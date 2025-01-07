import React, { useContext, useState } from 'react';

import './Auth.css';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { ENV } from '../../shared/util/config';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

type Props = {};

const Auth = (props: Props) => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const swichModeHandler = () => {
        if (!isLoginMode) {
            // signup mode to login
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: undefined,
                        isValid: true,
                    },
                },
                formState.inputs['email'].isValid && formState.inputs['password'].isValid
            );
        } else {
            // login mode to signup
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginMode((prevMode) => !prevMode);
    };

    const authSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoginMode) {
            //try login
            try {
                const responseData = await sendRequest(
                    `/api/users/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs['email'].value,
                        password: formState.inputs['password'].value,
                    }),
                    { 'Content-Type': 'application/json' }
                );
                auth.login(responseData.user.id);
            } catch (err) {
                //이미에러처리함
            }
        } else {
            //try sign up
            try {
                const responseData = await sendRequest(
                    `/api/users/signup`,
                    'POST',
                    JSON.stringify({
                        name: formState.inputs['name'].value,
                        email: formState.inputs['email'].value,
                        password: formState.inputs['password'].value,
                    }),
                    {
                        'Content-Type': 'application/json',
                    }
                );
                auth.login(responseData.user.id);
            } catch (err) {
                //이미에러처리함
            }
        }

        //login
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form className="" onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name"
                            onInput={inputHandler}
                        />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address "
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters "
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={swichModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </>
    );
};

export default Auth;
