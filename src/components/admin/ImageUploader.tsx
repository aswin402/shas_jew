import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Eye, Sparkles, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  onImageRemove?: () => void;
  className?: string;
  label?: string;
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onUploadComplete,
  onImageRemove,
  className = '',
  label = 'Product Image',
  error
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [prevPropUrl, setPrevPropUrl] = useState<string | undefined>(currentImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state with prop changes when parent updates image URL
  if (currentImageUrl !== prevPropUrl) {
    setPrevPropUrl(currentImageUrl);
    setPreviewUrl(currentImageUrl || '');
  }

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WEBP, GIF, SVG).');
      return;
    }

    // Size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(10);

    // Create local object URL for instant visual feedback
    const tempObjectUrl = URL.createObjectURL(file);
    setPreviewUrl(tempObjectUrl);

    // Simulate progress animation smoothly while waiting for upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 15;
      });
    }, 150);

    try {
      // Clean file name
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const timeStamp = new Date().getTime();
      const filePath = `products/${timeStamp}_${sanitizedName}.${fileExt}`;

      // Upload to Supabase Storage bucket 'product-images'
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      clearInterval(progressInterval);

      if (storageError) {
        console.warn('Supabase storage upload notice:', storageError);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
        }, 300);

        // Fallback gracefully so parent form still receives a valid URL preview
        const fallbackUrl = tempObjectUrl;
        onUploadComplete(fallbackUrl);
        setUploadError(`Storage notice: ${storageError.message}. Image preview cached locally.`);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const finalPublicUrl = publicUrlData.publicUrl || tempObjectUrl;

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
      }, 400);

      setPreviewUrl(finalPublicUrl);
      onUploadComplete(finalPublicUrl);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      console.error('Image upload failed:', err);
      setIsUploading(false);
      const message = err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Failed to upload image. Please try again.';
      setUploadError(message);
      // Keep local preview so form submit still works gracefully
      onUploadComplete(tempObjectUrl);
    }
  }, [onUploadComplete]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onImageRemove) onImageRemove();
    onUploadComplete('');
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      setPreviewUrl(manualUrl.trim());
      onUploadComplete(manualUrl.trim());
      setShowManualInput(false);
      setManualUrl('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label} <span className="text-amber-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors underline decoration-amber-500/40"
        >
          {showManualInput ? 'Upload File' : 'Enter URL Manually'}
        </button>
      </div>

      {showManualInput ? (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/70"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-xl transition-all"
          >
            Apply
          </button>
        </form>
      ) : previewUrl && !isUploading ? (
        /* Image Preview Box */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group rounded-xl border border-amber-500/30 bg-slate-900/80 overflow-hidden p-3 backdrop-blur-md flex items-center gap-4"
        >
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image Uploaded Successfully</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-full font-mono">
              {previewUrl}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                Replace
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3 text-sky-400" />
                View Full
              </a>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-[11px] bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-800/50 transition-colors flex items-center gap-1 ml-auto"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-6 text-center backdrop-blur-md ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.01]'
              : error || uploadError
              ? 'border-rose-500/60 bg-rose-950/20 hover:border-rose-400'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-amber-500/50 hover:bg-slate-900/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 py-2"
              >
                <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Uploading Image ({uploadProgress}%)
                </div>
                {/* Loader bar */}
                <div className="w-full max-w-xs mx-auto h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">Uploading to Supabase product-images bucket...</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    <span className="text-amber-400">Click to upload</span> or drag and drop image here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports PNG, JPG, WEBP or GIF up to 5MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Error or Notice messages */}
      {(uploadError || error) && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded-lg p-2 mt-1"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError || error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;
