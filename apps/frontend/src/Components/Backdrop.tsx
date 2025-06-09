import { motion } from 'framer-motion'
import React from 'react'

interface BackdropProps {
    children?: React.ReactNode,
    onClick: React.MouseEventHandler<HTMLDivElement>
}

const Backdrop : React.FC<BackdropProps> = ({ children, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}

export default Backdrop