import React, { useEffect, useState } from 'react';
import UserTable from '../../components/userTable/UserTable';
import {
  getUsers,
  formateUserData,
  userCTA,
} from '../../utils/getDataFunctions';
import { Radio } from 'antd';
import { toast } from 'react-toastify';
import messages from '../../utils/messages.json';

// use the useEffect hook to call api on page render (GET api/billing-manager/users?status=active&role_id=1&p=1 )

// also set the filter for the role based on the roleId and map the role to roleId;

const ActiveUsers = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(0);

  const status = 'active';
  const search = window.location.search;
  const queries = search.split('&');
  let role_id = 0;
  let page = 1;

  if (queries.length === 3) {
    role_id = queries[1].substring(8);
    page = queries[2].substring(5);
  } else if (queries.length === 2) {
    role_id = queries[1].substring(8);
  }

  useEffect(() => {
    async function getData() {
      console.log(status, role_id, page);
      const { ans, res } = await getUsers(status, parseInt(role_id), page);
      if (res.status === 200) {
        const activeUserData = formateUserData(ans.data.rows);
        setPageData({ totalCount: ans.data.count, limit: ans.limit });
        setUsers(activeUserData);
        setLoading(false);
      } else {
        toast.error(ans.message);
      }
    }
    getData();
    setURL(role_id, page);
  }, [token]);

  const setURL = (currentRoleId, page = 1) => {
    const queryParam = `?status=${status}&role_id=${currentRoleId}&page=${page}`;
    window.history.pushState(null, '', queryParam);
  };
  const handleChange = async (e) => {
    setLoading(true);
    if (e.target.value === '0') {
      //api call without role_id;
      setRoleId(0);
      const { ans, res } = await getUsers(status, 0);
      if (res.status === 200) {
        const activeUserData = formateUserData(ans.data.rows);
        setUsers(activeUserData);
        setPageData({ totalCount: ans.data.count, limit: ans.limit });
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(ans.message);
      }
      setURL(0);
    } else if (e.target.value === '2') {
      //api call with query parameter of role_id=2;
      setRoleId(2);
      const { ans, res } = await getUsers(status, e.target.value);
      if (res.status === 200) {
        const activeUserData = formateUserData(ans.data.rows);
        setUsers(activeUserData);
        setPageData({ totalCount: ans.data.count, limit: ans.limit });
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(ans.message);
      }
      setURL(2);
    } else {
      //api call with query parameter of role_id=3;
      setRoleId(3);
      const { ans, res } = await getUsers(status, e.target.value);
      if (res.status === 200) {
        const activeUserData = formateUserData(ans.data.rows);
        setUsers(activeUserData);
        setPageData({ totalCount: ans.data.count, limit: ans.limit });
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(ans.message);
      }
      setURL(3);
    }
  };
  const getPaginatedData = async (page) => {
    setLoading(true);
    const { ans, res } = await getUsers(status, roleId, page);
    const userData = formateUserData(ans.data.rows);
    if (res.status === 200) {
      setUsers(userData);
      setLoading(false);
      setPageData({ totalCount: ans.data.count, limit: ans.limit });
      setURL(roleId, page);
    }
  };
  const handleDeactivateCTA = async (email) => {
    try {
      const clickedUser = users.filter((user) => {
        return user.email === email;
      });
      const id = clickedUser[0].id;
      const { res, ans } = await userCTA(id);
      if (res.status === 200) {
        setUsers((pre) => {
          return pre.filter((user) => user.id !== id);
        });
        toast.success(ans.message);
      } else {
        toast.error(ans.message);
      }
    } catch (error) {
      toast.error(messages.GENERAL_ERROR);
    }
  };
  return (
    <div>
      <div className="buttonGroup">
        <Radio.Group
          data-testid="radioGroup"
          defaultValue={`${role_id}`}
          buttonStyle="solid"
          onChange={handleChange}
        >
          <Radio.Button value="0" data-testid="all">
            All
          </Radio.Button>
          <Radio.Button value="3" data-testid="nurse">
            Nurse
          </Radio.Button>
          <Radio.Button value="2" data-testid="billingAdmin">
            Billing Admin
          </Radio.Button>
        </Radio.Group>
      </div>
      <UserTable
        data={users}
        pageData={pageData}
        getPaginatedData={getPaginatedData}
        loading={loading}
        handleCTA={handleDeactivateCTA}
      />
    </div>
  );
};
export default ActiveUsers;

// "data": [
// {
// "firstName": "Steve",
// "lastName": "Smith",
// "email": "steve@yopmail.com",
// "roleId": 2,
// "status": "invited"
// }
// ]
