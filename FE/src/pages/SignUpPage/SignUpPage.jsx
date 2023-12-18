import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import imageLogo from '../../assets/images/logo-login.png'
import * as userService from '../../services/UserService'
import * as message from '../../components/Message/Message'
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
const SignUpPage = () => {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //navigate
    const handleNavigateSignIn = () => {
        navigate("/sign-in")
    }
    
     // call API
     const mutation = useMutationHooks(
        data => userService.signupUser(data)
    )
    const {data, isPending, isSuccess, isError} = mutation
    console.log("huy",mutation);
    useEffect(() => {
        if(data?.status === 'ERR') {           
             message.error();
        }else if(isSuccess){
            message.success();
            handleNavigateSignIn();        
        }
    }, [isSuccess, isError])
    //handle input
    const handleOnChangeEmail = (value) => {
        setEmail(value);
    }

    const handleOnchangePassword = (value) => {
        setPassword(value);
    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value);
    }

    const handleSignUp = () => {
        mutation.mutate({
            email, password, confirmPassword
        })
        // console.log('signUp', email, password, confirmPassword);
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
                    <InputForm style={{marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnChangeEmail}/>
                    <div style={{ position: 'relative' }}>
                        <span
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-84%)',
                            right: '8px',
                        }}
                        >{
                            isShowPassword ? (
                            <EyeFilled />
                            ) : (
                            <EyeInvisibleFilled />
                            )
                        }
                        </span>
                        <InputForm placeholder="password" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"}
                        value={password} onChange={handleOnchangePassword} 
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <span
                        onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                        style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-40%)',
                            right: '8px'
                        }}
                        >{
                            isShowConfirmPassword ? (
                            <EyeFilled />
                            ) : (
                            <EyeInvisibleFilled />
                            )
                        }
                        </span>
                        <InputForm placeholder="comfirm password" type={isShowConfirmPassword ? "text" : "password"}
                        value={confirmPassword} onChange={handleOnchangeConfirmPassword}
                        />
                    </div>
                    {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
                    <Loading isLoading={isPending}>
                        <ButtonComponent
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            size={40}
                            styleButton={{
                                background: 'green',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px',
                            }}
                            textButton={'Đăng ký'}
                            styleTextButton={{ color: '#d9d9d9', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image
                        src={imageLogo} 
                        alt='image-logo' 
                        preview={false}
                        height="203px"
                        width="203px"
                    />
                    <h4>Mua sắm tại Shop</h4>
                </WrapperContainerRight>
            </div>
        </div>
    );
}

export default SignUpPage;
