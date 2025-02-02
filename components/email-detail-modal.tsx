import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { formatDistanceToNow } from 'date-fns'
import { Mail, Image as ImageIcon } from 'lucide-react'
import DOMPurify from 'dompurify'
import Image from 'next/image'

interface EmailDetailModalProps {
  email: any
  isOpen: boolean
  onClose: () => void
}


export function EmailDetailModal({ email, isOpen, onClose }: EmailDetailModalProps) {
  if (!email) return null
  
  const sanitizedContent = DOMPurify.sanitize(
    email.content.replace(/\n/g, '<br>')
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] w-[1800px] h-[98vh] bg-black/90 border-white/10">
        <DialogHeader className="border-b border-white/10 pb-6">
          <DialogTitle className="text-2xl font-semibold text-white/90">
            {email.subject || '(No subject)'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[calc(98vh-8rem)] overflow-hidden">
          {/* Email metadata */}
          <div className="flex items-start gap-8 p-8 border-b border-white/10 bg-white/5">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
              <span className="text-xl text-white/90">
                {email.from.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium text-lg text-white/90">{email.from}</p>
                  <p className="text-sm text-white/60">To: me</p>
                </div>
                <p className="text-sm text-white/50">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Email content with better styling */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-invert prose-lg max-w-none">
              {email.attachments && email.attachments.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-4">
                  {email.attachments.map((attachment: any, index: number) => (
                    <div key={index} className="relative group">
                      {attachment.type.startsWith('image/') ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                          <Image
                            src={attachment.url}
                            alt={attachment.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                          <ImageIcon className="w-8 h-8 text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={attachment.url}
                          download={attachment.name}
                          className="text-xs text-white/90 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div 
                className="text-white/90 space-y-4 [&_a]:text-purple-400 [&_a]:hover:underline 
                  [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4
                  [&_p]:leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal
                  [&_ul]:pl-4 [&_ol]:pl-4 [&_blockquote]:border-l-4
                  [&_blockquote]:border-white/20 [&_blockquote]:pl-4
                  [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg
                  [&_pre]:bg-black/40 [&_pre]:p-4 [&_pre]:rounded-lg
                  [&_code]:bg-black/40 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}