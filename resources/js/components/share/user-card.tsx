import { Link } from '@inertiajs/react';
import { Card, CardContent } from '../ui/card';
import { dateTimeFormat } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { UserCardProp } from '@/types/types';

export function UserCard({ card }: {card: UserCardProp}) {
    return (
        <Card className="relative h-auto min-h-50 w-full overflow-hidden">
            <CardContent className="flex h-full flex-col px-4">
                {/* Title with truncation */}
                <Link href={route('inbox-shares.users.detail', card.email)}>
                    <h4 className="text-xs flex items-center gap-3 mb-2"><Calendar size={20}/> Since : {dateTimeFormat(card.started_time)}</h4>
                    <table className="table text-left text-sm">
                        <tbody>
                            <tr className="text-lg font-semibold">
                                <th>Name:</th>
                                <th className='px-3'>{card.name }</th>
                            </tr>
                            <tr>
                                <th>Email:</th>
                                <td className="px-3">{card.email}</td>
                            </tr>
                            <tr className="mb-3 align-top">
                                <th>Diaries: </th>
                                <td className="px-3">
                                    {card.diaries?.shared || card.diaries?.received ? (
                                        <ul className="">
                                            {card.diaries?.shared ? (
                                                <li className="w-full">
                                                    Shared {card.diaries.shared} {card.diaries.shared > 1 ? 'Diaries' : 'Diary'} to me
                                                </li>
                                            ) : (
                                                ''
                                            )}
                                            {card.diaries?.received ? (
                                                <li className="w-full">
                                                    Received {card.diaries.received} {card.diaries.received > 1 ? 'Diaries' : 'Diary'} from me
                                                </li>
                                            ) : (
                                                ' |'
                                            )}
                                        </ul>
                                    ) : (
                                        '---'
                                    )}
                                </td>
                            </tr>
                            <tr className="mb-3 align-top">
                                <th>Collections: </th>
                                <td className="px-3">
                                    {card.collections?.shared || card.collections?.received ? (
                                        <ul className="">
                                            {card.collections?.shared ? (
                                                <li className="w-full">
                                                    Shared {card.collections.shared} {card.collections.shared > 1 ? 'Collections' : 'Collection'} to
                                                    me
                                                </li>
                                            ) : (
                                                ''
                                            )}
                                            {card.collections?.received ? (
                                                <li className="w-full">
                                                    Received {card.collections.received}{' '}
                                                    {card.collections.received > 1 ? 'Collections' : 'Collection'} from me
                                                </li>
                                            ) : (
                                                ''
                                            )}
                                        </ul>
                                    ) : (
                                        '---'
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Link>
            </CardContent>
        </Card>
    );
}
