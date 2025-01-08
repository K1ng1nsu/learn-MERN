import { useCallback, useReducer } from 'react';

type FormStateType = {
    inputs: {
        [key: string]: {
            value?: string | Blob;
            isValid: boolean;
        };
    };
    isValid: boolean;
};

type InitialInputsType = {
    [key: string]: {
        value?: string;
        isValid: boolean;
    };
};

type InputHandlerType = (id: string, value: string | Blob | undefined, isValid: boolean) => void;

type FormActionType = {
    inputs?: InitialInputsType;
    type: 'INPUT_CHANGE' | 'SET_DATA';
    inputId?: string;
    isValid: boolean;
    value?: string | Blob;
};

const formReducer = (state: FormStateType, action: FormActionType): FormStateType => {
    switch (action.type) {
        case 'INPUT_CHANGE': {
            let formIsValid = true;
            for (const inputId of Object.keys(state.inputs)) {
                // if (!state.inputs[inputId]) {
                //     continue;
                // }

                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId!]: { value: action.value, isValid: action.isValid },
                },
                isValid: formIsValid,
            };
        }
        case 'SET_DATA':
            return {
                inputs: action.inputs!,
                isValid: action.isValid,
            };

        default:
            return state;
    }
};

export const useForm = (
    initialInputs: InitialInputsType,
    initialFormValidity: boolean
): [FormStateType, InputHandlerType, (inputData: InitialInputsType, formValidity: boolean) => void] => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    const inputHandler = useCallback((id: string, value: string | Blob | undefined, isValid: boolean) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value,
            isValid,
            inputId: id,
        });
    }, []);

    const setFormData = useCallback((inputData: InitialInputsType, formValidity: boolean) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            isValid: formValidity,
        });
    }, []);

    return [formState, inputHandler, setFormData];
};
