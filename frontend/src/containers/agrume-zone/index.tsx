import { FunctionComponent, useState, useEffect } from 'react'
import {COMPARTMENT} from '../../utils/config'
import { ZoneItem } from '../../components/zone-item'
import useWebSocket, {SendMessage} from 'react-use-websocket'

type IrrigationZones = {
    [key: string]: boolean
}
type Compartment={pin:number, compartment:string}
type Body = {
    action: string,
    type: string
    recipientNickname?:string
    body: {
        type?: string,
        pin?: string,
        mode?: string,
        status?: string
    }  & string
}

export const AgrumeZone:FunctionComponent = ()=>{
    const [isTapOn, setIsTapOn] = useState<IrrigationZones>({
        'Melon Yoruba': false,
        'Melon Charentais': false,
        'Tomate': false,
        'Papaye Calina IPB9': false,
        'Papaye F1 Horizon': false,
        // 'Papaye Solo Amaricain': false,
        // 'Papaye Solo': false,
        // zone23: false
    })

    const { sendMessage } = useWebSocket(
        `wss://${process.env.REACT_APP_WS_URL}.execute-api.eu-central-1.amazonaws.com/dev?nickname=admin`,
        {onMessage:(event)=>{ 
            if (event.data !== null) {
                const parsedMessage = JSON.parse(event.data) as Body
                const body = parsedMessage.body
                if (
                    parsedMessage.action === "msg" && 
                    body?.status === 'ok' &&
                    parsedMessage.type === 'digitalWriteStatus'
                ) {
                    const compartment = COMPARTMENT.agrume.find(item=> item.pin === parseInt(body.pin || ''))
                    if(compartment){
                        setIsTapOn(prevState=>({
                            ...prevState,
                            [compartment.compartment]: !isTapOn[compartment.compartment]

                        }))
                    }
                    
                }else if(parsedMessage.action === "msg" && parsedMessage.type === "output"){
                    for(let pin of body.split('_')){
                            const compartment = COMPARTMENT.agrume.find(item=> item.pin === parseInt(pin || ''))
                            if(pin !== '' && compartment){
                                setIsTapOn(prevState=>({
                                    ...prevState,
                                    [compartment.compartment]: true

                                }))
                            }
                    }
                }
            }

        }}
    )
  
   useEffect(()=>{
      sendMessage(
            JSON.stringify({
            action: "msg",
            type: "cmd",
            recipientNickname:"kati",
            body: {
                type: "digitalRead",
            },
            })
        )
    },[])

    const onOnClick = (zoneId:number)=>{
        sendMessage(
            JSON.stringify({
            action: "msg",
            type: "cmd",
            recipientNickname:"kati",
            body: {
                type: "pinMode",
                pin:zoneId,
                mode: "output",
            },
            })
        )

        sendMessage(
            JSON.stringify({
                action: "msg",
                type: "cmd",
                recipientNickname:"kati",
                body: {
                type: "digitalWrite",
                pin: zoneId,
                value: 1,
                },
            })
        )
        
    }

    const onOffClick = (zoneId:number)=>{
        sendMessage(
            JSON.stringify({
                action: "msg",
                type: "cmd",
                recipientNickname:"kati",
                body: {
                type: "digitalWrite",
                pin: zoneId,
                value: 0,
                },
            })
        )
    }
    
    const showZone = (item:Compartment, ind:number)=>{
        return (
            <ZoneItem 
                key={ind}
                zone={item.compartment}
                onOnClick={()=>onOnClick(item.pin)}
                onOffClick={()=>onOffClick(item.pin)}
                isTapOn={isTapOn[item.compartment] as boolean}
            />
        )
    }

    return(
        <div className="w-full mt-[70px] px-2 md:mt-14 md:grid  grid-cols-2 gap-4 w-11/12 m-auto">
            {
                (COMPARTMENT.agrume as Compartment[] || []).map(showZone)
            }
        </div>
    )
}