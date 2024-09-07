import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { Test_Api } from '../Config';

export default function Post() {
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [post, setPost] = useState([]);
    const [postData, setPostData] = useState({
        vCatId: '',
        vImage: '',
        vStartColor: '',
        vEndColor: '',
        vTextColor: '',
        vLanguageCode: '',
        vLanguageId: ''
    })
    const [options, setOptions] = useState([]);

    useEffect(() => {
        loadOptions();
    }, [])

    const loadOptions = async () => {
        try {
            const response = await axios.post(`${Test_Api}category/list`, { vLanguageId: '65f1272c2a844399c0486c75' });
            const data = response.data.data.map(category => ({
                label: category.vName,
                value: category._id,
                id: category._id
            }));
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    // category select handle ---------------------------
    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setPostData(prevState => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : ''
        }));
        if (selectedOption) {
            fetchData(selectedOption.id);
            console.log("Selected Options ===>", selectedOption);

        }
    };
    return (
        <div>
            <div className='my-3'>
                <div className='side-container category-form p-3'>
                    <form action="">
                        <div className='row'>
                            <div className='col-lg-12 mb-3'>
                                <label htmlFor="">Category Name</label>
                                <Select className='mb-3'
                                    value={selectedCategory}
                                    onChange={handleCategorySelect}
                                    onMenuOpen={loadOptions}
                                    options={options}
                                    required
                                />
                            </div>
                            <div className='col-lg-6 mb-3'>
                                <label htmlFor="image">Image</label>
                                <input type="file" name="image" id="image" className='form-control' />
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className='d-inline-block'>
                                    <label htmlFor="startcolor">Start Color</label>
                                    <input type="color" name="startcolor" id="startcolor" className='form-control p-0 color-input' />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="endcolor">End Color</label>
                                    <input type="color" name="endcolor" id="endcolor" className='form-control p-0 color-input' />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="textcolor">Text Color</label>
                                    <input type="color" name="textcolor" id="textcolor" className='form-control p-0 color-input' />
                                </div>
                            </div>

                            <div className='col-lg-3 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="languagecode">Language Code</label>
                                    <input type="text" name="languagecode" id="languagecode" className='form-control' />
                                </div>
                            </div>

                            <div className='col-lg-12 mb-2 text-center'>
                                <button type='submit' className='btn btn-success'>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}
