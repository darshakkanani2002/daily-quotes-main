import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Img_Url, Test_Api } from '../Config';
import LanguageSelect from '../language/LanguageSelected';

export default function Banner() {
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [banner, setBanner] = useState([]);
    const [bannerData, setBannerData] = useState({
        vLanguageId: '',
        vBannerImg: '',
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.post(`${Test_Api}banner/details`)
            .then((response) => {
                console.log("Banner image Data ==>", response.data.data);
                setBanner(response.data.data || []);
            })
            .catch(error => {
                console.log("Fetch error:", error);
            });
    };


    // Handle Language Select
    const handleLanguageSelect = (selectedOption) => {
        setSelectedLanguage(selectedOption);
        setBannerData((prevState) => ({
            ...prevState,
            vLanguageId: selectedOption ? selectedOption.id : '',
        }));
        if (selectedOption) {
            fetchData(selectedOption.id);
            console.log('Selected Options ===>', selectedOption);
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerData({ ...bannerData, vBannerImg: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('vBannerImg', bannerData.vBannerImg);
        formData.append('vLanguageId', bannerData.vLanguageId);

        axios.post(`${Test_Api}category/list`, { vLanguageId: bannerData.vLanguageId }, formData)
            .then((response) => {
                console.log("Banner image saved successfully:", response.data);
                fetchData();
                setPreview(null);
                setBannerData({ vBannerImg: '' });
            })
            .catch((error) => {
                console.error("Error saving banner:", error);
            });
    };

    return (
        <div>
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className='col-12'>
                            <label>
                                Select Language <span className="text-danger">*</span>
                            </label>
                            <LanguageSelect
                                value={selectedLanguage}
                                selectedLanguage={selectedLanguage}
                                handleLanguageSelect={handleLanguageSelect}
                            />
                        </div>
                        <div className="col-lg-12">
                            <label htmlFor="icon">Banner Image</label>
                            <input
                                type="file"
                                name="file"
                                id="icon"
                                className="form-control mb-3"
                                onChange={handleFileChange}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                                />
                            )}
                        </div>

                        <div className="col-lg-12 text-center">
                            <button type="submit" className="btn btn-success">Add Data</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="side-container my-5">
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Banner Image</th>
                                <th>Delete/Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banner.length > 0 ? (
                                banner.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>
                                            <img
                                                crossOrigin="anonymous"
                                                src={`${Img_Url}${item.vBannerImg}`}
                                                alt={`${item.vBannerImg}`}
                                                className="category-icon"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger mx-2"
                                                onClick={() => setDeleteId(item._id)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button
                                                className="btn btn-success mx-2"
                                                onClick={() => handleUpdate(item)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan="3" className="py-3">Data Not Found!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
