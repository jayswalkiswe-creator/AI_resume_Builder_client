import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        {
            id: "classic",
            name: "Classic",
            preview: "A clean, traditional resume format with clear sections and professional typography"
        },
        {
            id: "modern",
            name: "Modern",
            preview: "Sleek design with strategies use of color and modern font choices"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview: "Minimal design with a single image and clean typography"
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: "Ultra clean design that puts your content front and center"
        },
    ]

  return (
    <div className='relative'>
        <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 ring-blue-300 dark:ring-blue-700 hover:ring transition-all px-3 py-2 rounded-lg'>
            <Layout size={14}/> <span className='max-sm:hidden'>Template</span>
        </button>
        {isOpen && (
            <div className='absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 shadow-sm'>
                {templates.map((template)=>(
                    <div key={template.id} onClick={() => {onChange(template.id); setIsOpen(false)}} className={`relative p-3 border rounded-md cursor-pointer transition-all ${
                        selectedTemplate === template.id
                        ? "border-blue-400 bg-blue-100 dark:bg-blue-900 dark:border-blue-500"
                        : "border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}>
                        {selectedTemplate === template.id && (
                            <div className='absolute top-2 right-2'>
                                <div className='size-5 bg-blue-400 dark:bg-blue-500 rounded-full flex items-center justify-center'>
                                    <Check className='w-3 h-3 text-white' />
                                </div>
                            </div>
                        )}

                        <div className='space-y-1'>
                            <h4 className='font-medium text-gray-800 dark:text-slate-200'>{template.name}</h4>
                            <div className='mt-2 p-2 bg-blue-50 dark:bg-blue-900/40 rounded text-xs text-gray-500 dark:text-slate-400 italic'>{template.preview}</div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default TemplateSelector