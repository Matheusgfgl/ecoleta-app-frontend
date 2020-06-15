import React , {useCallback, useState} from 'react'
import  {useDropzone} from 'react-dropzone'
import {FiUpload} from 'react-icons/fi'

import './styles.css'

interface Props {
  onFileUploaded: (file: File) => void;
}
const Dropzone: React.FC<Props> = ({onFileUploaded}) => {


  const [selectedFileUrl, setSelectedFile] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file)
    setSelectedFile(fileUrl)
    onFileUploaded(file)

  }, [onFileUploaded])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return(
            <div className = "dropzone" {...getRootProps()}>
              <input {...getInputProps()} accept="image/*"/>

              { selectedFileUrl //operacao ternaria
                  ? <img src = {selectedFileUrl} alt = "point "/>
                  :  (
                    <p>
                    <FiUpload/>
                    Imagem do Estabelecimento
                  </p>
                  )
              }
              
            </div>
  )
}
export default Dropzone