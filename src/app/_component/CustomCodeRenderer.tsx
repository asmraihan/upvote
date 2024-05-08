'use client'

function CustomCodeRenderer({ data }: any) {
  (data)

  return (
    <pre className='bg-zinc-900 rounded-md p-4'>
      <code className='text-gray-100 text-sm'>{data.code}</code>
    </pre>
  )
}

export default CustomCodeRenderer