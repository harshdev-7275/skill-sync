import { Bot, BrainCog, LogOut, Settings } from 'lucide-react'
import { TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const navigate = useNavigate()
    return (
        <div className='h-screen w-[80px] overflow-hidden'>
            <div className="container px-2 py-4 h-full">
                <div className='flex flex-col items-center gap-10 h-full'>
                    <BrainCog size={40} className='text-blue-700' />
                    <div className='flex flex-col items-center gap-6 relative h-full'>
                        <TooltipProvider >
                            <Tooltip>
                                <TooltipTrigger><Bot /></TooltipTrigger>
                                <TooltipContent>
                                    <button onClick={()=> navigate('/dashboard/chatbot')}>ChatBot</button>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger><Settings /></TooltipTrigger>
                                <TooltipContent>
                                    <p>Settings</p>
                                </TooltipContent>
                            </Tooltip>
                            <div className='absolute bottom-0'>
                                <Tooltip >
                                    <TooltipTrigger><LogOut /></TooltipTrigger>
                                    <TooltipContent>
                                        <p>Log Out</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Sidebar