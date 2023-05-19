import { FunctionComponent } from 'react'
//import cx from 'classnames'

type CustomButton = {
    className:string
    type: 'submit' | 'button' | 'reset' | undefined
    onClick?:()=>void
    name: string
    disabled?:boolean
}

export const CustomButton:FunctionComponent<CustomButton> = ({
    className,
    type,
    onClick,
    name,
    disabled=false
})=>{
    return(
        <div 
        >
            <button
            className="w-full font-bold"
                type={type}
                onClick={onClick}
                disabled={disabled}
            >
                {name}
            </button>
        </div>
    )
}

// className={cx(
//             className, 
//             'py-2', {
//                 "bg-gray-300":disabled, 
//                 "bg-[#ac05bbc0]":!disabled, 
//                 "hover:bg-[#7d2be9c0]":!disabled}
//             )}