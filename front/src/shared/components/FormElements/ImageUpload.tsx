import React, { useEffect, useRef, useState } from 'react';

import './ImageUpload.css';
import Button from './Button';

type Props = {
    id: string;
    center?: boolean;
    onInput: (id: string, pickedFile: Blob | undefined, isValid: boolean) => void;
    errorText: string;
};

const ImageUpload = (props: Props) => {
    const [file, setFile] = useState<Blob>();
    const [previewUrl, setPreviewUrl] = useState<string | null>();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result?.toString());
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let pickedFile;
        let fileIsValid = isValid;
        if (e.target.files && e.target.files.length === 1) {
            pickedFile = e.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }

        if (pickedFile) {
            props.onInput(props.id, pickedFile, fileIsValid);
        } else {
            props.onInput(props.id, pickedFile, fileIsValid);
        }
    };

    const pickImageHandler = () => {
        filePickerRef.current?.click();
    };

    return (
        <div className="form-control">
            <input
                type="file"
                ref={filePickerRef}
                id={props.id}
                style={{ display: 'none' }}
                accept=".jpg,.png,.jpeg"
                onChange={pickHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    PICK IMAGE
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;
