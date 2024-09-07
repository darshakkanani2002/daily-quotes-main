import React from 'react'
import Select from 'react-select';

export default function Post() {
    return (
        <div>
            <div className='my-3'>
                <div className='side-container category-form p-3'>
                    <form action="">
                        <div className='row'>
                            <div className='col-lg-12 mb-3'>
                                <label htmlFor="">Category Name</label>
                                <Select></Select>
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
