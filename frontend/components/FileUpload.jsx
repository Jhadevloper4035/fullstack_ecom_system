import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";

export const resizeAndUpload = (file) => {
    return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
            file,
            600,
            800,
            "JPEG",
            100,
            0,
            (uri) => {
                axios
                    .post(`${process.env.NEXT_PUBLIC_API_URL}/cloudinary/uploadimages`, { image: uri })
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            },
            "Base64"
        );
    });
};

const FileUpload = ({ values, setValues, setLoading }) => {
    const fileUploadandResize = (e) => {
        let files = e.target.files;
        let allUploadedFiles = values.images || [];

        if (files) {
            setLoading(true);
            for (let i = 0; i < files.length; i++) {
                resizeAndUpload(files[i])
                    .then((data) => {
                        setLoading(false);
                        setValues((prev) => ({
                            ...prev,
                            images: [...(prev.images || []), data],
                        }));
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.log("CLOUDINARY UPLOAD ERR", err);
                    });
            }
        }
    };

    const handleImageRemove = (public_id) => {
        setLoading(true);
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/cloudinary/removeimages`, { public_id })
            .then((res) => {
                setLoading(false);
                const { images } = values;
                let filteredImages = images.filter((item) => {
                    return item.public_id !== public_id;
                });
                setValues({ ...values, images: filteredImages });
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    return (
        <>
            <div className="row">
                {values.images &&
                    values.images.map((image) => (
                        <div key={image.public_id} className="badge-container" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
                            <div
                                onClick={() => handleImageRemove(image.public_id)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    cursor: 'pointer',
                                    background: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                X
                            </div>
                            <img
                                src={image.url}
                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                alt="product"
                            />
                        </div>
                    ))}
            </div>
            <div className="row">
                <label className="btn btn-primary btn-raised mt-3">
                    Choose File
                    <input
                        type="file"
                        multiple
                        hidden
                        accept="images/*"
                        onChange={fileUploadandResize}
                    />
                </label>
            </div>
        </>
    );
};

export default FileUpload;
