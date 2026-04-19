import React, { useEffect, useState } from 'react';
import { dummyResumeData } from '../assets/assets';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, LayoutIcon, Loader2 as Loader2Icon, PencilIcon, Share2Icon, Sparkles, User } from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const ResumeBuilder = () => {

  const { resumeId } = useParams();
  const { token } = useSelector(state => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })
  
  const loadExistingResume = async () => {
      try {
        const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } });
        if(data.resume) {
          setResumeData(data.resume);
          document.title = data.resume.title;
        }
      } catch (error) {
        console.error(error.message);
      }
    } 

     const [activeSectionIndex, setActiveSectionIndex] = useState(0); 
     const [removeBackground, setRemoveBackground] = useState(false);
     const [previewMode, setPreviewMode] = useState(false);
     const [tips, setTips] = useState([]);
     const [loadingTips, setLoadingTips] = useState(false);
     const [atsResult, setAtsResult] = useState(null);
     const [loadingAts, setLoadingAts] = useState(false);
    

    const sections = [
      { id: 'personal', name: 'Personal Info', icon: User },
      { id: 'summary', name: 'Summary', icon: FileText },
      { id: 'experience', name: 'Experience', icon: Briefcase },
      { id: 'education', name: 'Education', icon: GraduationCap },
      { id: 'projects', name: 'Projects', icon: FolderIcon },
      { id: 'skills', name: 'Skills', icon: Sparkles },
    ]

    const activeSection = sections [activeSectionIndex];

  useEffect(() => {
    loadExistingResume()
  }, [])

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }));
      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } });
      setResumeData({...resumeData, public: !resumeData.public});
      toast.success(data.message);
    } catch (error) {
      console.error("Error Saving Resume: ". error);
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if(navigator.share) {
      navigator.share({url: resumeUrl, text: "My Resume", })
    } else {
      alert('Share not supported on this Browser.')
    }
  }

  const fetchResumeTips = async () => {
    setLoadingTips(true);
    try {
      const { data } = await api.post('/api/ai/resume-tips', { resumeData }, { headers: { Authorization: token } });
      setTips(data.tips);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to get tips');
    } finally {
      setLoadingTips(false);
    }
  }

  const fetchAtsScore = async () => {
    setLoadingAts(true);
    try {
      const { data } = await api.post('/api/ai/ats-score', { resumeData }, { headers: { Authorization: token } });
      setAtsResult(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to get ATS score');
    } finally {
      setLoadingAts(false);
    }
  }

  const downloadResume = () => {
    const preview = document.getElementById('resume-preview');

    const styles = Array.from(document.styleSheets).map(sheet => {
      try {
        return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
      } catch { return ''; }
    }).join('');

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${resumeData.title || 'Resume'}</title>
          <style>${styles}</style>
          <style>
            @page { size: A4; margin: 0; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>${preview.innerHTML}</body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  }

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData);

      //remove image from updatedResumeData
      if(typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image);

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } });

      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      console.error("Error Saving Resume: ", error);
    }
  }

  

  return (
    <div>
        <div className='max-w-7xl mx-auto px-4 py-6 flex items-center justify-between'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all'>
          <ArrowLeftIcon className='size-4' /> Back to Dashboard
        </Link>
        <button onClick={() => setPreviewMode(p => !p)} className='lg:hidden flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm'>
          {previewMode ? <><PencilIcon className='size-4' /> Edit</> : <><LayoutIcon className='size-4' /> Preview</>}
        </button>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel - Form  */}
          <div className={`relative lg:col-span-5 rounded-lg overflow-hidden ${previewMode ? 'hidden lg:block' : ''}`}>
            <div className='bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 pt-1'>
              {/* Progress Bar using activeSectionIndex  */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000' style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}} />

              {/* Section Nevigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 dark:border-slate-700 py-1'>
                <div className='flex items-center gap-2'>
                    <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=> setResumeData( prev =>({...prev ,template }))}/>
                      <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev =>({...prev, accent_color:color}))}/>
                </div>

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                    Next <ChevronRight className='size-4' />
                  </button>
                </div>
              </div>

                  {/* Form Content */}
                <div className='space-y-6'>
                  {activeSection.id === 'personal' && (
                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({...prev, personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                  )}
                  { activeSection.id === 'summary' && (
                    <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({...prev, professional_summary: data}))} setResumeData={setResumeData} />
                  )}
                  { activeSection.id === 'experience' && (
                    <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({...prev, experience: data}))}/>
                  )}
                  { activeSection.id === 'education' && (
                    <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({...prev, education: data}))}/>
                  )}
                  { activeSection.id === 'projects' && (
                    <ProjectForm data={resumeData.project} onChange={(data) => setResumeData(prev => ({...prev, project: data}))}/>
                  )}
                  { activeSection.id === 'skills' && (
                    <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({...prev, skills: data}))} profession={resumeData.personal_info?.profession} />
                  )}

                  
                </div>
                <button onClick={() => toast.promise(saveResume(), {loading: 'Saving...', success: 'Saved!', error: (e) => e?.response?.data?.message || 'Failed to save'})} className='bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 ring-green-300 dark:ring-green-700 text-green-600 dark:text-green-400 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                  Save Changes
                </button>

                {/* Resume Tips */}
                <div className='mt-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>AI Resume Tips</span>
                    <button onClick={fetchResumeTips} disabled={loadingTips} className='flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50'>
                      {loadingTips ? <><Loader2Icon className='size-3 animate-spin' /> Getting tips...</> : <><Sparkles className='size-3' /> Get Tips</>}
                    </button>
                  </div>
                  {tips.length > 0 && (
                    <ul className='space-y-1'>
                      {tips.map((tip, i) => (
                        <li key={i} className='text-xs text-slate-600 dark:text-slate-400 flex gap-2'><span className='text-purple-500'>•</span>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ATS Score */}
                <div className='mt-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>ATS Score</span>
                    <button onClick={fetchAtsScore} disabled={loadingAts} className='flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50'>
                      {loadingAts ? <><Loader2Icon className='size-3 animate-spin' /> Analyzing...</> : <><Sparkles className='size-3' /> Check ATS</>}
                    </button>
                  </div>
                  {atsResult && (() => {
                    const s = atsResult.score;
                    const color = s >= 80 ? 'text-green-600 dark:text-green-400' : s >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400';
                    const bar = s >= 80 ? 'bg-green-500' : s >= 50 ? 'bg-yellow-500' : 'bg-red-500';
                    const label = s >= 80 ? '🟢 ATS Ready!' : s >= 50 ? '🟡 Needs Improvement' : '🔴 Poor ATS Compatibility';
                    return (
                      <div className='space-y-2'>
                        <div className='flex justify-between items-center'>
                          <span className='text-xs text-slate-500 dark:text-slate-400'>{label}</span>
                          <span className={`text-sm font-bold ${color}`}>{s}/100</span>
                        </div>
                        <div className='w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                          <div className={`h-2 rounded-full transition-all duration-500 ${bar}`} style={{width: `${s}%`}} />
                        </div>
                        <ul className='space-y-1 mt-2'>
                          {atsResult.feedback.map((item, i) => (
                            <li key={i} className='text-xs flex gap-2 items-start'>
                              <span>{item.status === 'pass' ? '✅' : item.status === 'warn' ? '⚠️' : '❌'}</span>
                              <span className={item.status === 'pass' ? 'text-green-600 dark:text-green-400' : item.status === 'warn' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                        <p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>⚠️ This is an AI estimate, not a real ATS scan.</p>
                      </div>
                    );
                  })()}
                </div>
            </div>
          </div>

          {/*Right Panel - Preview */}
          <div className={`lg:col-span-7 max-lg:mt-6 ${!previewMode ? 'hidden lg:block' : ''}`}>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-400 rounded-lg ring-blue-300 dark:ring-blue-700 hover:ring transition-colors'>
                    <Share2Icon className='size-4' /> Share
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 text-purple-600 dark:text-purple-400 ring-purple-300 dark:ring-purple-700 rounded-lg hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button onClick={downloadResume} className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 text-green-600 dark:text-green-400 rounded-lg ring-green-300 dark:ring-green-700 hover:ring transition-colors'>
                  <DownloadIcon className='size-4' /> Download
                </button>
              </div>
            </div>

                  <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>

          </div>
        </div>
      </div>

    </div>
  )
}

export default ResumeBuilder