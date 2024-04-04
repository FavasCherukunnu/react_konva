import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div className='flex flex-col gap-3'>
            <Link to={'/imageEditor'} className='  p-2 bg-gray-400/40 hover:bg-gray-400/30 rounded-md' >Image Editor</Link>
            <Link to={'/pdfEditor'} className=' p-2 bg-gray-400/40 hover:bg-gray-400/30 rounded-md' >Pdf Editor</Link>
        </div>
    )
}
