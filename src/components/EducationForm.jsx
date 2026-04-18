import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import React from 'react'

const EducationForm = ({data, onChange}) => {

    const toMonthInput = (val) => {
        if (!val) return ''
        if (/^\d{4}-\d{2}$/.test(val)) return val
        const d = new Date(val)
        if (isNaN(d)) return ''
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    const addEducation = () => {
        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: ""
        }
        onChange([...data, newEducation]);
    }

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    }
    
    return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-slate-100'>Education</h3>
                <p className='text-sm text-gray-500 dark:text-slate-400'>Add your education details</p>
            </div>
            <button onClick={addEducation} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors'>
                <Plus className='size-4'/>
                Add Education
            </button>
        </div>

      {data.length === 0 ? (
        <div className='text-center pt-8 text-gray-500 dark:text-slate-500'>
            <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-slate-600' />
            <p>No Education added yet</p>
            <p className='text-sm'>Click "Add Education" to get started</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((education, index)=>(
            <div key={index} className='p-4 border border-gray-200 dark:border-slate-700 rounded-lg space-y-3 dark:bg-slate-800/50'>
              <div className='flex justify-between items-start'>
                <h4 className='dark:text-slate-200'>Education #{index+1}</h4>
                <button onClick={() => removeEducation(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                  <Trash2 className='size-4' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input value={education.institution || ""} onChange={(e) => updateEducation(index, "institution", e.target.value)} type='text' name={`institution-${index}`} placeholder='Institution Name' className='px-3 py-2 text-sm' />

                <input value={education.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} type='text' name={`degree-${index}`} placeholder='Degree (e.g., Bachelor, Master)' className='px-3 py-2 text-sm' />

                <input value={education.field || ""} onChange={(e) => updateEducation(index, "field", e.target.value)} type='text' name={`field-${index}`} placeholder='Field of Study (e.g., Computer Science, Business)' className='px-3 py-2 text-sm' />

                <input value={toMonthInput(education.graduation_date)} onChange={(e) => updateEducation(index, "graduation_date", e.target.value)} type='month' name={`graduation_date-${index}`} className='px-3 py-2 text-sm' />
              </div>

                <input value={education.gpa || ""} onChange={(e) => updateEducation(index, "gpa", e.target.value)} type='text' name={`gpa-${index}`} placeholder='GPA (Optional)' className='px-3 py-2 text-sm' />
              
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm