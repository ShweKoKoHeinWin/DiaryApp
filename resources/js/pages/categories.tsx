import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Switch, Table } from '@radix-ui/themes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: route('categories.index', undefined, false),
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <Switch defaultChecked size='3' />
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                            <Table.Cell>danilo@example.com</Table.Cell>
                            <Table.Cell>Developer</Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
                            <Table.Cell>zahra@example.com</Table.Cell>
                            <Table.Cell>Admin</Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
                            <Table.Cell>jasper@example.com</Table.Cell>
                            <Table.Cell>Developer</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </div>
        </AppLayout>
    );
}
