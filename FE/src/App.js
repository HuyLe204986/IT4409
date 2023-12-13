import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
// eslint-disable-next-line
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode';
import * as userService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide';
import Loading from './components/LoadingComponent/Loading';
export function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);   
    const user = useSelector((state) => state.user)
    useEffect(() => {
        setIsLoading(true);
        const  { storageData, decoded } = handleDecoded();
        if(decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData)
        }
        // console.log('storage data: ' +storageData);
        setIsLoading(false);
    }, []);

    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let decoded = {}
        if(storageData  && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return { decoded, storageData }
    }

    userService.axiosJWT.interceptors.request.use(async (config) => {
        // Do something before request is sent
        const currentTime = new Date();
        const  { decoded } = handleDecoded();
        if(decoded?.exp < currentTime.getTime() / 1000) {
            const data = await userService.refreshToken();
            console.log('refesh',data);
            config.headers['token'] = `Bearer ${data?.access_token}`
        }
        return config;
    }, (error) => {
        // Do something with request error
        console.log('da bi loi');
        return Promise.reject(error);
    });

    const handleGetDetailsUser = async (id, token) => {
        const res = await userService.getDetailsUser(id, token);
        dispatch(updateUser({...res?.data, access_token: token}))
        // console.log('res', res);
    }

    // const fetchApi = async () => {
    //     const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll`);
    //     return res.data;
    // }
    // // Queries
    // const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
    // console.log('query', query);
    return (
        <div>
            <Loading isLoading={isLoading}>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page;
                            // const isCheckAuth = !route.isPrivate || user.isAdmin
                            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
                            //isCheckAuth &&
                            return <Route key={route.path} path={ route.path} element={
                                <Layout>
                                    <Page />
                                </Layout>
                            } />;
                        })}
                    </Routes>
                </Router>
            </Loading>
        </div>
    );
}
export default App;
