import { Loader2, Plus, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const SkillsForm = ({data, onChange, profession}) => {

    const { token } = useSelector(state => state.auth);
    const [newSkill, setNewSkill] = useState("");
    const [suggesting, setSuggesting] = useState(false);

    const suggestSkills = async () => {
        setSuggesting(true);
        try {
            const { data: res } = await api.post('/api/ai/suggest-skills', { profession }, { headers: { Authorization: token } });
            const newSkills = res.skills.filter(s => !data.includes(s));
            onChange([...data, ...newSkills]);
            toast.success('Skills suggested!');
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setSuggesting(false);
        }
    }

    const addSkill = () => {
        if(newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()]);
            setNewSkill("");
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove));
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    }

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-slate-100'>Skills</h3>
        <p className='text-sm text-gray-500 dark:text-slate-400'>Add your technical and soft skills</p>
      </div>

      <div className='flex gap-2'>
        <input type='text' name='newSkill' placeholder='Enter a Skill (e.g., JavaScript, Project Management' className='flex-1 px-3 py-2 text-sm' onChange={(e) => setNewSkill(e.target.value)} value={newSkill} onKeyDown={handleKeyPress} />
        <button onClick={addSkill} disabled={!newSkill.trim()} className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
            <Plus className='size-4' /> Add
        </button>
      </div>

      <button onClick={suggestSkills} disabled={suggesting || !profession} title={!profession ? 'Add your profession in Personal Info first' : 'Suggest skills with AI'} className='flex items-center gap-2 px-4 py-2 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
        {suggesting ? <Loader2 className='size-4 animate-spin' /> : <Sparkles className='size-4' />}
        {suggesting ? 'Suggesting...' : 'Suggest Skills with AI'}
      </button>

      {data.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
            {data.map((skill, index) => (
                <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm'>
                    {skill}
                    <button onClick={() => removeSkill(index)} className='ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors'>
                        <X className='w-3 h-3' />
                    </button>
                </span>
            ))}
        </div>
      ):(
        <div className='text-center py-6 text-gray-500 dark:text-slate-500'>
            <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-slate-600' />
            <p>No Skills added yet</p>
            <p className='text-sm'>Add Your technical and soft skills above.</p>
        </div>
      )}
      <div className='bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg'>
        <p className='text-sm text-blue-500 dark:text-blue-400'><strong>Tip:</strong> Add 8-12 relevant skills. Include both technical and soft skills.</p>
      </div>
    </div>
  )
}

export default SkillsForm
