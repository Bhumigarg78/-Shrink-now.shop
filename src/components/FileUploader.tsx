import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo, FileImage, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept: Record<string, string[]>;
  label: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, accept, label }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });

  const getIcon = () => {
    if (accept['video/*']) return <FileVideo size={48} />;
    if (accept['image/*']) return <FileImage size={48} />;
    if (accept['application/pdf']) return <FileText size={48} />;
    return <Upload size={48} />;
  };

  return (
    <div 
      {...getRootProps()} 
      className={`glass uploader-container ${isDragActive ? 'active' : ''}`}
      style={{
        padding: '60px 40px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px dashed var(--glass-border)',
        marginTop: '20px'
      }}
    >
      <input {...getInputProps()} />
      <div style={{ color: 'var(--accent-color)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        {getIcon()}
      </div>
      <h3>{label}</h3>
      <p style={{ marginTop: '10px' }}>
        {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
      </p>
    </div>
  );
};

export default FileUploader;
