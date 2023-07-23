import { render, screen } from '@testing-library/react';
import UserTable from './UserTable';

const users = [
  {
    firstName: 'Alex',
    lastName: 'Bob',
    email: 'alex@yopmail.com',
    role: 'Nurse',
    status: 'active',
  },
  {
    firstName: 'Maria',
    lastName: 'Nelson',
    email: 'maria@yopmail.com',
    roleId: 'Billing Admin',
    status: 'invited',
  },
  {
    firstName: 'Maria',
    lastName: 'Nelson',
    email: 'maria@yopmail.com',
    roleId: 'Billing Admin',
    status: 'inactive',
  }
];

test('render the table', () => {
  delete window.location;
    window.location = {
      pathname: '/users',
      search: '?status=active&role_id=1&page=1',
    };
  const pageData = {limit:10,totalCount:3}
  render(<UserTable data={users} pageData={pageData} />);
  const tableElement = screen.getByRole('table');
  expect(tableElement).toBeInTheDocument();
});
