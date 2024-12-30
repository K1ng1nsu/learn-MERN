import React, { useEffect, useReducer } from 'react';

import './Input.css';
import { validate, ValidatorsType } from '../../util/validators';

type InputHandlerType = (id: string, value: string, isValid: boolean) => void;

type Props = {
    element: 'input' | 'textarea';
    id: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    rows?: number;
    label: string;
    errorText: string;
    validators: ValidatorsType;
    onInput: InputHandlerType;
    initialValue?: string;
    initialValid?: boolean;
};

type InputStateType = { value: string; isValid: boolean; isTouched: boolean };
type ActionType =
    | {
          type: 'CHANGE';
          val: string;
          validators: ValidatorsType;
      }
    | { type: 'TOUCH' };

const inputReducer = (state: InputStateType, action: ActionType): InputStateType => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators),
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    }
};

const Input = (props: Props) => {
    const initialInputState: InputStateType = {
        value: props.initialValue || '',
        isValid: props.initialValid || false,
        isTouched: false,
    };

    const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(props.id, inputState.value, inputState.isValid);
    }, [id, value, isValid, onInput]);

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: 'CHANGE', val: event.target.value, validators: props.validators });
    };

    const touchHandler = () => {
        dispatch({ type: 'TOUCH' });
    };

    const element =
        props.element === 'input' ? (
            <input
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
        ) : (
            <textarea
                rows={props.rows || 3}
                id={props.id}
                onChange={changeHandler}
                value={inputState.value}
                onBlur={touchHandler}
            ></textarea>
        );

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};

export default Input;
