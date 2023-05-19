import { FunctionComponent } from 'react'
import {GiTap} from 'react-icons/gi'

type ZoneItem={
    onOnClick: ()=>void
    onOffClick: ()=>void
    isTapOn: boolean
    zone: string
}


export const ZoneItem:FunctionComponent<ZoneItem> = ({
    onOffClick,
    onOnClick,
    isTapOn,
    zone
})=>{

    return(
        <div className="bg-[#6200EE] p-2 rounded shadow-lg mt-4 md:mt-4">
            <div className="text-center font-bold my-4 ml-12">
                <h2 className={`text-xl font-bold ${isTapOn? 'text-[#08f508]': 'text-white'}`}>{zone}</h2>
            </div>
            <div className="flex justify-cols w-1/2 m-auto">
                <div className="flex-none">
                    <GiTap color={isTapOn?"#08f508":'#FFFFFF'} size={50}/>
                </div>
                <div className="flex justify-center w-full items-center">
                    <span className={`font-bold ${isTapOn? 'text-[#08f508]': 'text-white'}`}>{isTapOn? 'ON': 'OFF'}</span>
                </div>
            </div>
            <div className="flex justify-cols items-center justify-between w-1/2 m-auto mt-9">
                <div 
                    onClick={()=>isTapOn&&onOffClick()}
                    className=" bg-[#ECB7BF] shadow-xl p-4 mb-4 cursor-pointer rounded ">
                    <span className="font-bold">OFF</span>
                </div>
                <div 
                    onClick={()=>!isTapOn&&onOnClick()}
                    className={` ${isTapOn?'bg-[#08f508]': 'bg-[#ECB7BF]'} shadow-xl p-4 mb-4 cursor-pointer rounded`}>
                    <span className={`font-bold ${isTapOn?'text-white': ''}`}>ON</span>
                </div>
            </div>
        </div>
    )
}