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

// use the useEffect hook to call api on page render (GET api/billing-manager/users?status=inactive&role_id=1&p=1 )

// also set the filter for the role based on the roleId and map the role to roleId;

const InactiveUsers = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [roleId, setRoleId] = useState(0);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(true);
  const status = 'inactive';
  const search = window.location.search;
  const queries = search.split('&');
  const role_id = +queries[1].substring(8);
  const page = +queries[2].substring(5);
  useEffect(() => {
    async function getData() {
      const { ans, res } = await getUsers(status, role_id, page);

      if (res.status === 200) {
        const inactiveUserData = formateUserData(ans.data.rows);
        setUsers(inactiveUserData);
        setPageData({ totalCount: ans.data.count, limit: ans.limit });
        setLoading(false);
      } else {
        toast.error(ans.message);
        setLoading(false);
      }
    }
    getData();
    setURL(role_id);
  }, [token]);

  const setURL = (currentRoleId, currentPage = page) => {
    const queryParam = `?status=${status}&role_id=${currentRoleId}&page=${currentPage}`;
    window.history.pushState(null, '', queryParam);
  };

  const handleChange = async (e) => {
    setLoading(true);
    if (e.target.value === '0') {
      //api call without role_id;
      setRoleId(0);
      const { ans, res } = await getUsers(status);

      if (res.status === 200) {
        const inactiveUserData = formateUserData(ans.data.rows);
        setUsers(inactiveUserData);
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
      const { ans, res } = await getUsers(status, 2);

      if (res.status === 200) {
        const inactiveUserData = formateUserData(ans.data.rows);
        setUsers(inactiveUserData);
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
      const { ans, res } = await getUsers(status, 3);
      if (res.status === 200) {
        const inactiveUserData = formateUserData(ans.data.rows);
        setUsers(inactiveUserData);
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
  const handleAactivateCTA = async (email) => {
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
        handleCTA={handleAactivateCTA}
      />
    </div>
  );
};
export default InactiveUsers;
