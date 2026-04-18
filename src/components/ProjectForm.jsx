import { Plus, Trash2 } from 'lucide-react';
import React from 'react'

const ProjectForm = ({data, onChange}) => {
    const addProject = () => {
            const newProject = {
                name: "",
                type: "",
                description: ""
            }
            onChange([...data, newProject]);
        }

        const removeProject = (index) => {
            const updated = data.filter((_, i) => i !== index);
            onChange(updated);
        }

        const updateProject = (index, field, value) => {
            const updated = [...data];
            updated[index] = { ...updated[index], [field]: value };
            onChange(updated);
        }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-slate-100'>Projects</h3>
            <p className='text-sm text-gray-500 dark:text-slate-400'>Add your Project</p>
        </div>
        <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors'>
            <Plus className='size-4' />
            Add Project
        </button>
      </div>

        <div className='space-y-4 mt-6'>
            {data.map((project, index) => (
                <div key={index} className='p-4 border border-gray-200 dark:border-slate-700 rounded-lg space-y-3 dark:bg-slate-800/50'>
                    <div className='flex justify-between items-start'>
                        <h4 className='dark:text-slate-200'>Project #{index+1}</h4>
                        <button onClick={() => removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                            <Trash2 className="size-4" />
                        </button>
                    </div>

                    <div className='grid gap-3'>
                        <input value={project.name || ""} onChange={(e) => updateProject(index, "name", e.target.value)} type='text' name={`project_name-${index}`} placeholder='Project Name' className='px-3 py-2 text-sm rounded-lg' />

                        <input value={project.type || ""} onChange={(e) => updateProject(index, "type", e.target.value)} type='text' name={`project_type-${index}`} placeholder='Project Type (e.g., Web App, Mobile App)' className='px-3 py-2 text-sm' />
                        
                        <textarea rows={4} value={project.description || ""} onChange={(e) => updateProject(index, "description", e.target.value)} name={`project_desc-${index}`} placeholder='Description of your project' className='w-full px-3 py-2 text-sm rounded-lg resize-none' />
                    </div>

                </div>
            ))}
        </div>
    </div>
  )
}

export default ProjectForm