import React, { useState } from 'react';
import BasicLayout from '../layouts/BasicLayout';
import axios from 'axios';
import ModalComponent from 'component/common/ModalComponent';
import { useNavigate } from 'react-router-dom';
import '../../src/App.css'
import '../../src/pages/Authentication/SignUp/style.css'


const Login = () => {
    // 아이디와 비밀번호를 상태로 관리합니다
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const [idValid, setIdValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);


    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const customCallback = ()=>{
        if(message === '로그인 성공!'){
            navigate("/")
        } else{
            setIsOpen(false)
        }
    }
    
    // 아이디 입력 시 상태 업데이트 핸들러
    const handleId = (e) => {
        setId(e.target.value);
        const regex =
            /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{5,10}$/; // 아이디 정규식 : 문자/숫자 포함 형태의 2~10자리 이내 
        if(regex.test(e.target.value)){
            setIdValid(true);
        } else{
            setIdValid(false);
        }
    };

    // 비밀번호 입력 시 상태 업데이트 핸들러
    const handlePassword = (e) => {
        setPassword(e.target.value);
        const regex =
            /^(?=.*\d)(?=.[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,13}$/; // 비밀번호 정규식 : 특수문자/문자/숫자 포함 형태의 8~20자리
        if(regex.test(e.target.value)) {
            setPasswordValid(true);
        } else{
            setPasswordValid(false);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idValid || !passwordValid) {
            alert("유효한 아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            let formData= new FormData();
            formData.append('username', id);
            formData.append('password',password);
            const response = await axios.post('http://localhost:4040/login', formData,{
                withCredentials: true // 자격 증명을 포함하여 요청
              });
            // 로그인 성공 처리
            setMessage("로그인 성공!")
            setIsOpen(true)
            // 사용자 정보를 로컬 스토리지에 저장하거나 상태로 관리합니다.
            localStorage.setItem('access', response.headers.get('access'));

            
        } catch (error) {
            if (error.response.status === 401) setMessage('아이디 혹은 비밀번호가 틀렸습니다.');
            else setMessage('서버 오류')
            setIsOpen(true)
            console.error('로그인 오류:', error);

        }
    };

    return (
        <>
            <BasicLayout>
                {isOpen && <ModalComponent message={message} callbackFunction={customCallback}/>}
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
                            로그인
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="id" className="block text-sm font-medium leading-6 text-gray-900">
                                        아이디
                                    </label>
                                    <div className="text-sm">
                                        <a href="/find/id" className="font-semibold text-indigo-400 hover:text-indigo-600">
                                            아이디를 잊으셨나요?
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="id"
                                        name="id"
                                        type="text"
                                        placeholder="아이디를 입력하세요"
                                        autoComplete="id"
                                        required
                                        value={id}
                                        onChange={handleId}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 placeholder-gray-400 text-sm py-2 px-3"
                                    />
                                </div>
                            </div>

                            <div className='errorMessageWrap'>
                                {
                                    !idValid && id.length > 0 &&(
                                        <div>올바른 아이디를 입력해주세요.</div>
                                    )
                                }
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        비밀번호
                                    </label>
                                    <div className="text-sm">
                                        <a href="/find/pwd" className="font-semibold text-indigo-400 hover:text-indigo-600">
                                            비밀번호를 잊으셨나요?
                                        </a>
                                    </div>
                                    
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={handlePassword}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 placeholder-gray-400 text-sm py-2 px-3"
                                    />
                                </div>
                                <div className='errorMessageWrap'>
                                {
                                    !passwordValid && password.length > 0 &&(
                                        <div>영문, 숫자 포함 8자 이상 입력해주세요.</div>
                                    )
                                }
                            </div>
                            </div>

                            <div>
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-orange-400 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    로그인
                                </button>
                            </div>
                        </form>

                        <p className="mt-4 text-center text-sm text-gray-500">
                            <a href="/join" className="font-semibold leading-6 text-orange-300 hover:text-orange-600">
                                회원가입하러 가기
                            </a>
                        </p>
                        <hr className="my-8" />
                        <p className="mt-4 text-center text-sm text-gray-500">
                            SNS 계정으로 로그인하기
                        </p>
                        <div className="flex justify-center items-center mt-3">
                        <div className='sign-up-content-sign-in-button-box'>
                            <a href='http://localhost:4040/oauth2/authorization/kakao'> <div className='kakao-sign-in-button'/> </a>
                            <a href='http://localhost:4040/oauth2/authorization/naver'><div className='naver-sign-in-button'/> </a>
                        </div>
                        </div>
                    </div>
                </div>
            </BasicLayout>
        </>
    );
}

export default Login;