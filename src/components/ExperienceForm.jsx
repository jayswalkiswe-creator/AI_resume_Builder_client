import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const ExperienceForm = ({data, onChange}) => {

  const { token } = useSelector(state => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const toMonthInput = (val) => {
    if (!val) return ''
    if (/^\d{4}-\d{2}$/.test(val)) return val
    const d = new Date(val)
    if (isNaN(d)) return ''
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
        }
        onChange([...data, newExperience]);
    }

    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateExperience = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    }

    const generateDescription = async (index) => {
        setGeneratingIndex(index);
        const experience = data[index];
        const prompt = `Write a professional job description for the position of ${experience.position} at ${experience.company}${experience.description ? `. Enhance this existing description: ${experience.description}` : ''}.`;
        try {
            const response = await api.post('/api/ai/enhance-job-desc', {userContent: prompt}, { headers: { Authorization: token }});
            updateExperience(index, "description", response.data.enhancedContent);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setGeneratingIndex(-1);
        }
    }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-slate-100'>Profesional Experience</h3>
                <p className='text-sm text-gray-500 dark:text-slate-400'>Add your job experience</p>
            </div>
            <button onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors'>
                <Plus className='size-4'/>
                Add Experience
            </button>
        </div>

      {data.length === 0 ? (
        <div className='text-center pt-8 text-gray-500 dark:text-slate-500'>
            <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-slate-600' />
            <p>No work Experience added yet</p>
            <p className='text-sm'>Click "Add Experience" to get started</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((experience, index)=>(
            <div key={index} className='p-4 border border-gray-200 dark:border-slate-700 rounded-lg space-y-3 dark:bg-slate-800/50'>
              <div className='flex justify-between items-start'>
                <h4 className='dark:text-slate-200'>Experience #{index+1}</h4>
                <button onClick={() => removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                  <Trash2 className='size-4' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input value={experience.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type='text' name={`company-${index}`} placeholder='Company Name' className='px-3 py-2 text-sm rounded-lg' />
                <input value={experience.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type='text' name={`position-${index}`} placeholder='Job Title' className='px-3 py-2 text-sm rounded-lg' />
                <input value={toMonthInput(experience.start_date)} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type='month' name={`start_date-${index}`} className='px-3 py-2 text-sm rounded-lg' />
                <input value={toMonthInput(experience.end_date)} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type='month' name={`end_date-${index}`} disabled={experience.is_current} className='px-3 py-2 text-sm rounded-lg disabled:bg-gray-100 dark:disabled:bg-slate-700' />
              </div>

              <label className='flex items-center gap-2'>
                <input type='checkbox' checked={experience.is_current || false} onChange={(e) => {updateExperience(index, "is_current", e.target.checked ? true: false); }} className='rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                  <span className='text-sm text-gray-700 dark:text-slate-300'>Currently Working Here</span>
              </label>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                   <label htmlFor={`description-${index}`} className='text-sm font-medium text-gray-700 dark:text-slate-300'>Job Description</label>
                       <button onClick={() => generateDescription(index)} disabled={generatingIndex === index || !experience.position || !experience.company} title={!experience.position || !experience.company ? 'Fill in Company Name and Job Title first' : 'Enhance with AI'} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                         {generatingIndex === index ? (
                                    <Loader2 className='w-3 h-3 animate-spin' />
                                ): (
                                    <Sparkles className='w-3 h-3' />
                                )}
                                {generatingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                        </button>
                </div>
                <textarea value={experience.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} name={`description-${index}`} rows={4} className='w-full text-sm px-3 py-2 rounded-lg resize-none' placeholder='Describe your key responsibilities and achievements...' />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm