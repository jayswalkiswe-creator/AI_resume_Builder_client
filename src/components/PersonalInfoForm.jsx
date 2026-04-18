import { BriefcaseBusiness, Globe, Linkedin, Loader2, Mail, MapPin, Phone, Sparkles, User } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const PersonalInfoForm = ({data, onChange, removeBackground, setRemoveBackground}) => {
  
    const { token } = useSelector(state => state.auth);
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [suggestingTitles, setSuggestingTitles] = useState(false);

    const suggestJobTitles = async () => {
        if (!data.profession) return;
        setSuggestingTitles(true);
        try {
            const { data: res } = await api.post('/api/ai/suggest-job-titles', { query: data.profession }, { headers: { Authorization: token } });
            setTitleSuggestions(res.titles);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setSuggestingTitles(false);
        }
    }
    const handleChange = (field, value) => {
        onChange({...data, [field]: value});
    }
  
    const fields = [
        {key: "full_name", label: "Full Name", icon: User, type: "text", required: true, autoComplete: "name"},
        {key: "email", label: "Email Address", icon: Mail, type: "email", required: true, autoComplete: "email"},
        {key: "phone", label: "Phone Number", icon: Phone, type: "tel", autoComplete: "tel"},
        {key: "location", label: "Location", icon: MapPin, type: "text", autoComplete: "address-level2"},
        {key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text", autoComplete: "organization-title"},
        {key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url", autoComplete: "url"},
        {key: "website", label: "Personal Website", icon: Globe, type: "url", autoComplete: "url"}
    ]

    return (

    <div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-slate-100'>Personal Information</h3>
        <p className='text-sm text-gray-600 dark:text-slate-400'>Get Started with the Personal Information</p>
        <div className='flex items-center gap-2'>
            <label>
                { data.image ? (
                    <img src={typeof data.image === 'string' ? data.image: URL.createObjectURL(data.image)} alt='user-image' className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80' />
                ) : (
                    <div className='inline-flex items-center gap-2 mt-5 text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer'>
                        <User className='size-10 p-2.5 border rounded-full'/>
                        Upload User Image
                    </div>
                )}
                <input type="file" accept='image/jpeg, image/png' className='hidden' onChange={(e) => handleChange('image', e.target.files[0])}/>
            </label>
            {typeof data.image === 'object' && (
                <div className='flex flex-col gap-1 pl-4 text-sm'>
                    <p className='dark:text-slate-300'>Remove Background</p>
                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 dark:text-slate-100 gap-3'>
                    <input type='checkbox' className='sr-only peer' onChange={() => setRemoveBackground(prev => !prev)} checked={removeBackground} />
                        <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'></div>
                        <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                    </label>
                </div>
            )}
        </div>

        {fields.map((field)=>{
            const Icon = field.icon;
            return (
                <div key={field.key} className='space-y-1 mt-5'>
                    <label htmlFor={field.key} className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400'>
                        <Icon className='size-4'/>
                        {field.label}
                        {field.required && <span className='text-red-500'>*</span>} 
                    </label>
                    <input id={field.key} name={field.key} type={field.type} autoComplete={field.autoComplete || 'off'} value={data[field.key] || "" } onChange={(e) => handleChange(field.key, e.target.value)} className='mt-1 w-full px-3 py-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors text-sm' placeholder={`Enter Your ${field.label.toLowerCase()}`} required={field.required} />
                    {field.key === 'profession' && (
                        <div className='space-y-2'>
                            <button type='button' onClick={suggestJobTitles} disabled={suggestingTitles || !data.profession} className='flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                                {suggestingTitles ? <Loader2 className='size-3 animate-spin' /> : <Sparkles className='size-3' />}
                                {suggestingTitles ? 'Suggesting...' : 'Suggest Job Titles'}
                            </button>
                            {titleSuggestions.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {titleSuggestions.map((title, i) => (
                                        <button key={i} type='button' onClick={() => { handleChange('profession', title); setTitleSuggestions([]); }} className='px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors'>
                                            {title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        })}

    </div>
  )
}

export default PersonalInfoForm