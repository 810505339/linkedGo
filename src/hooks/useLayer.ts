import React, { useEffect, useState } from 'react'
import {
    ModalLayerController,
    ModalLayerFactory,
} from 'react-native-modal-layer'

export function useLayer(Layer: React.ElementType) {
    const [layer, setLayer] = useState<ModalLayerController>()
    useEffect(() => {
        setLayer(ModalLayerFactory.create(Layer))
        return () => {
            if (layer) ModalLayerFactory.delete(layer)
        }
    }, [])
    return layer
}
