import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import imageLogo from '../../assets/images/logo-login.png'
import { useLocation, useNavigate } from 'react-router-dom';
import * as userService from '../../services/UserService'
import { jwtDecode } from "jwt-decode";
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide';
import * as message from '../../components/Message/Message'
const SignInPage = () => {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const location = useLocation()
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    //navigate
    const handleNavigateSignUp = () => {
        navigate("/sign-up")
    }

    // call API
    const mutation = useMutationHooks(
        data => userService.loginUser(data)
    )
    console.log('mutation', mutation);
    
    const {data, isPending, isSuccess} = mutation

    useEffect(() => {
        if(data?.status === 'ERR') {           
            message.error();
       }else if(isSuccess){
        if(location?.state) {
            navigate(location?.state)
        }else {
            navigate('/')
        }
        localStorage.setItem('access_token', JSON.stringify(data?.access_token))
        if(data?.access_token) {
            const decoded = jwtDecode(data?.access_token);
            console.log('decoded', decoded);
            if(decoded?.id) {
                handleGetDetailsUser(decoded?.id, data?.access_token)
            }
        }
        }
    }, [isSuccess])

    // handle input
    const handleOnChangeEmail = (value) => {
        setEmail(value);
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password,
        })
    }

    const handleGetDetailsUser = async (id, token) => {
        const res = await userService.getDetailsUser(id, token);
        dispatch(updateUser({...res?.data, access_token: token}))
        console.log('res', res);
    }
   
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.53)',
                height: '100vh',
            }}
        >
            <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '6px', background: '#fff' }}>
                <WrapperContainerLeft>
                    <h1>WELCOME TO MY SHOP </h1>
                    <p>Vui lòng <span style={{color:'green'}}>Đ𝐚̆𝐧𝐠 𝐍𝐡𝐚̣̂𝐩</span> hoặc <span style={{color:'green'}}>𝐓𝐚̣𝐨 𝐓𝐚̀𝐢 𝐊𝐡𝐨𝐚̉𝐧</span> </p>
                    <InputForm 
                        style={{marginBottom: '10px'}} 
                        placeholder="abc@gmail.com" 
                        value={email} 
                        onChange={handleOnChangeEmail}
                    />
                    <div style={{ position: 'relative' }}>
                        <span
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '55%',
                            transform: "translateY(-50%)",
                            right: '8px'
                        }}
                        >{
                            isShowPassword ? (
                            <EyeFilled />
                            ) : (
                            <EyeInvisibleFilled />
                            )
                        }
                        </span>
                        <InputForm
                            placeholder="123456"
                            type={isShowPassword ? "text" : "password"}
                            value={password}
                            onChange={handleOnchangePassword}
                        />
                    </div>
                    {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
                    <Loading isLoading={isPending}>
                        <ButtonComponent
                            disabled={!email.length || !password.length}
                            onClick={handleSignIn}
                            size={40}
                            styleButton={{
                                background: 'rgb(51, 51, 51)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px',
                            }}
                            textButton={'Đăng nhập'}
                            styleTextButton={{ color: '#d9d9d9', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    {/* <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p> */}
                    <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image 
                        src={imageLogo} 
                        alt='image-logo' 
                        preview={false}
                        height="100%"
                        width="100%"
                    />
                    {/* <h4>Mua sắm tại Shop</h4> */}
                </WrapperContainerRight>
            </div>
        </div>
    );
};

export default SignInPage;
