import React, { useContext, useState } from 'react';

import './PlaceItem.css';
import { CoordinateType } from '../PlacesType';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';

type Props = {
    id: string;
    image: string;
    title: string;
    description: string;
    address: string;
    creatorId: string;
    coordinates: CoordinateType;
};

const PlaceItem = (props: Props) => {
    const auth = useContext(AuthContext);

    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const openConfirmModalHandler = () => setShowConfirmModal(true);
    const closeConfirmModalHandler = () => setShowConfirmModal(false);
    const confirmDeleteHandler = () => {
        setShowConfirmModal(false);
        console.log('DELETEING...');
    };

    return (
        <>
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map className="" center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={closeConfirmModalHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button onClick={closeConfirmModalHandler} inverse>
                            CANCEL
                        </Button>
                        <Button onClick={confirmDeleteHandler} danger>
                            DELETE
                        </Button>
                    </>
                }
            >
                <p>Do you want to proceed and delete this place? Please note that it can't be undone thereafter</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>
                        {auth.isLoggedIn && (
                            <>
                                <Button to={`/place/${props.id}`}>EDIT</Button>
                                <Button danger onClick={openConfirmModalHandler}>
                                    DELETE
                                </Button>
                            </>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
};

export default PlaceItem;