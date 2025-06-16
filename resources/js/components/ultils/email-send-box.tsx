import { MailOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const EmailSendbox = ({ allEmails }: { allEmails: string[] | null }) => {
    const sortedEmails = allEmails?.sort() || [];
    const [showEmailBox, setShowEmailBox] = useState<boolean>(false);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [mailLink, setMailLink] = useState<string>('');
    const handleEmailChange = (email: string, checked: boolean) => {
        if (checked) {
            setSelectedEmails([...selectedEmails.filter((e) => e !== email), email]);
        } else {
            setSelectedEmails(selectedEmails.filter((e) => e !== email));
        }
    };
    useEffect(() => {
        const emailList = selectedEmails.join(',');
        const mailtoLink = `mailto:${emailList}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        setMailLink(mailtoLink);        
    }, [subject, message, selectedEmails]);
    return (
        <div>
            <Button variant="ghost" size="icon" className="w-auto cursor-pointer px-2 py-1" onClick={() => setShowEmailBox(true)}>
                <MailOpen className="h-3.5 w-3.5" />
            </Button>
            <Dialog open={showEmailBox} onOpenChange={setShowEmailBox}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between">
                            <span>Send Email</span>
                            <label htmlFor="allEmail" className="mr-5 flex items-center justify-center gap-2">
                                <Checkbox
                                    id="allEmail"
                                    checked={
                                        selectedEmails.length === sortedEmails.length &&
                                        selectedEmails.sort().every((val, index) => val === sortedEmails[index])
                                    }
                                    onCheckedChange={(checked) => {
                                        if (checked === true) {
                                            setSelectedEmails(sortedEmails);
                                        } else {
                                            setSelectedEmails([]);
                                        }
                                    }}
                                />
                                <span>Select All</span>
                            </label>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription aria-describedby="dialog-description"></DialogDescription>
                    <ul className="h-50 max-w-md list-inside list-none space-y-1 overflow-y-scroll rounded-2xl border-2 bg-gray-900/5 p-4">
                        {sortedEmails.map((email, idx) => (
                            <li key={idx}>
                                <div className="inline-block w-[90%]">
                                    <Label className="flex items-center justify-between gap-2 rounded-xl bg-amber-600 p-3" htmlFor={`email-${idx}`}>
                                        {email}
                                        <Checkbox
                                            id={`email-${idx}`}
                                            checked={selectedEmails.includes(email)}
                                            onCheckedChange={(checked) => handleEmailChange(email, checked === true)}
                                        />
                                    </Label>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {selectedEmails.length > 0 && (
                        <div className="rounded-2xl bg-white p-4 dark:bg-gray-900">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="Enter Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                            </div>
                            {/* Form Actions */}
                            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                                <a href={mailLink} rel="noopener noreferrer" className="flex-1 sm:flex-row">
                                    <Button variant="secondary" size="icon" className='w-full' >
                                        <MailOpen className="h-3.5 w-3.5" /> Send to selected{' '}
                                        {selectedEmails.length > 1 ? `${selectedEmails.length} Emails` : '1 Email'}
                                    </Button>
                                </a>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSubject('');
                                        setMessage('');
                                    }}
                                    className="flex-1 sm:flex-none"
                                >
                                    Reset Form
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmailSendbox;
