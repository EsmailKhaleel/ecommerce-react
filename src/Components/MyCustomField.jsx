import { ErrorMessage, Field } from 'formik'

function MyCustomField({ type='text', placeholder='', name='' }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {placeholder.charAt(0).toUpperCase() + placeholder.slice(1)}
            </label>
            <Field
                type={type}
                name={name}
                className="w-full px-4 py-2 rounded-lg focus:border-b-secondary focus:border-b-2 bg-stone-100 outline-none transition-all"
                placeholder={`Enter your ${placeholder}`}
            />
            <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1 italic"/>
        </div>
    )
}

export default MyCustomField