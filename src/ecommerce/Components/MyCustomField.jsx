import { ErrorMessage, Field } from 'formik'
import React from 'react'

function MyCustomField({ type='text', label='' }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label.toUpperCase()}</label>
            <Field
                type={type}
                name={label}
                className="w-full px-4 py-2 rounded-lg focus:border-b-secondary focus:border-b-2 bg-stone-100 outline-none transition-all"
                placeholder={`Enter your ${label}`}
            />
            <ErrorMessage name={label} component="div" className="text-red-500 text-sm mt-1" />
        </div>
    )
}

export default MyCustomField