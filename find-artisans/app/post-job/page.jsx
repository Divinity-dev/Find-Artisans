'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '@/app/axios';
import { State, City } from 'country-state-city';
import { lgas } from 'nigerian-states-and-lgas';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify'

const PostJobPage = () => {
const [imagePreviews, setImagePreviews] = React.useState([]);

const nigeriaStates = State.getStatesOfCountry('NG');

const normalizeLgaStateName = (stateName) => {
  const supportedNameMap = {
    'Abuja Federal Capital Territory': 'Federal Capital Territory',
    'Katsina': 'Kastina',
  };

  return supportedNameMap[stateName] || stateName;
};

const router = useRouter();

const uploadToCloudinary = async (files) => {
  const uploadedUrls = [];

  for (const file of files) {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      uploadedUrls.push(data.secure_url);
    }
  }

  return uploadedUrls;
};

  const initialValues = {
    title: '',
    category: '',
    description: '',
    state: '',
    city: '',
    lga: '',
    address: '',
    budget: '',
    customerName: '',
    phone: '',
    urgency: 'Normal',
    images: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, 'Job title is too short')
      .required('Job title is required'),

    category: Yup.string()
      .required('Please select a category'),

    description: Yup.string()
      .min(30, 'Description should be at least 30 characters')
      .required('Description is required'),

      images: Yup.array()
  .max(5, 'Maximum of 5 images allowed'),

    state: Yup.string()
      .required('State is required'),

    city: Yup.string()
      .required('City is required'),

    lga: Yup.string()
      .required('Local Government Area is required'),

      address: Yup.string().required('Address is required'),

    customerName: Yup.string()
      .required('Your name is required'),

    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number')
      .required('Phone number is required'),

    budget: Yup.number()
      .typeError('Budget must be a number')
      .positive('Budget must be positive')
      .nullable(),
  });

 const handleSubmit = async (values, helpers) => {
  try {
    helpers.setStatus(null);

    let imageUrls = [];

    if (values.images?.length > 0) {
      imageUrls = await uploadToCloudinary(values.images);
    }

   const payload = {
  title: values.title,
  category: values.category,
  description: values.description,
  budget: values.budget,
  location: {
    state: values.state,
    city: values.city,
    address: values.lga,
  },
  images: imageUrls,
  phone: values.phone,
  urgency: values.urgency,
};

    await API.post('/jobs/create', payload);

    helpers.setStatus({
  type: 'success',
  message: 'Job posted successfully! Redirecting...',
});

setTimeout(() => {
  router.push('/jobs');
}, 1200);

    helpers.resetForm();
    setImagePreviews([]);
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        'Failed to post job. Please try again.'
    );
    helpers.setStatus({
      type: 'error',
      message:
        error?.response?.data?.message ||
        'Failed to post job. Please try again.',
    });
  } finally {
    helpers.setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-950 text-white px-5 py-12">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Post a Job
        </h1>

        <p className="text-gray-400 mb-8">
          Tell workers what you need and get responses quickly.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
  isSubmitting,
  status,
  setFieldValue,
  values,
}) => {

    const cities = values.state
  ? City.getCitiesOfState(
      'NG',
      nigeriaStates.find((s) => s.name === values.state)?.isoCode
    )
  : [];

const lgaStateName = normalizeLgaStateName(values.state);

const localGovernments = values.state
  ? lgas(lgaStateName) || []
  : [];

  return (
            <Form className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">

              {status && (
                <div
                  className={`p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-600'
                      : 'bg-red-600'
                  }`}
                >
                  {status.message}
                </div>
              )}

              {/* Job Title */}
              <div>
                <label className="block mb-2">
                  Job Title
                </label>

                <Field
                  name="title"
                  placeholder="Need a plumber to fix leaking pipes"
                  className="w-full bg-gray-800 p-3 rounded-lg"
                />

                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2">
                  Category
                </label>

                <Field
                  as="select"
                  name="category"
                  className="w-full bg-gray-800 p-3 rounded-lg"
                >
                  <option value="">
                    Select Category
                  </option>

                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>Mechanic</option>
                  <option>Cleaner</option>
                  <option>Painter</option>
                  <option>Carpenter</option>
                  <option>Welder</option>
                </Field>

                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2">
                  Job Description
                </label>

                <Field
                  as="textarea"
                  rows="6"
                  name="description"
                  placeholder="Describe the work you need done..."
                  className="w-full bg-gray-800 p-3 rounded-lg"
                />

                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <div>
  <label className="block mb-2">
    Job Images (Optional)
  </label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      const files = Array.from(e.target.files);

      setFieldValue('images', files);

      setImagePreviews(
        files.map((file) => URL.createObjectURL(file))
      );
    }}
    className="w-full bg-gray-800 p-3 rounded-lg"
  />

  <ErrorMessage
    name="images"
    component="div"
    className="text-red-400 text-sm mt-1"
  />

  {imagePreviews.length > 0 && (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {imagePreviews.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Preview"
          className="w-full h-24 object-cover rounded-lg"
        />
      ))}
    </div>
  )}
</div>

              {/* Location */}
<div>
  <label className="block mb-3 font-medium">
    Location
  </label>

  <div className="grid md:grid-cols-3 gap-4">

    {/* State */}
    <div>
      <Field
        as="select"
        name="state"
        className="w-full bg-gray-800 p-3 rounded-lg"
        onChange={(e) => {
          setFieldValue('state', e.target.value);
          setFieldValue('city', '');
          setFieldValue('lga', '');
        }}
      >
        <option value="">
          Select State
        </option>

        {nigeriaStates.map((state) => (
          <option
            key={state.isoCode}
            value={state.name}
          >
            {state.name}
          </option>
        ))}
      </Field>

      <ErrorMessage
        name="state"
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>

    {/* City */}
    <div>
      <Field
        as="select"
        name="city"
        className="w-full bg-gray-800 p-3 rounded-lg"
      >
        <option value="">
          Select City
        </option>

        {cities.map((city, index) => (
          <option
            key={index}
            value={city.name}
          >
            {city.name}
          </option>
        ))}
      </Field>

      <ErrorMessage
        name="city"
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>

    {/* LGA */}
    <div>
      <Field
        as="select"
        name="lga"
        className="w-full bg-gray-800 p-3 rounded-lg"
      >
        <option value="">
          Select LGA
        </option>

        {localGovernments.map((lga, index) => (
          <option
            key={index}
            value={lga}
          >
            {lga}
          </option>
        ))}
      </Field>

      <ErrorMessage
        name="lga"
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>

    {/* Address */}
<div className="md:col-span-3">
  <label className="block mb-2">
    Address
  </label>

  <Field
    name="address"
    placeholder="Enter detailed address (e.g. 123 Main St, Near XYZ landmark)"
    className="w-full bg-gray-800 p-3 rounded-lg"
  />

  <ErrorMessage
    name="address"
    component="div"
    className="text-red-400 text-sm mt-1"
  />
</div>

  </div>
</div>

              {/* Budget */}
              <div>
                <label className="block mb-2">
                  Budget (₦)
                </label>

                <Field
                  name="budget"
                  type="number"
                  placeholder="50000"
                  className="w-full bg-gray-800 p-3 rounded-lg"
                />

                <ErrorMessage
                  name="budget"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block mb-2">
                  Your Name
                </label>

                <Field
                  name="customerName"
                  className="w-full bg-gray-800 p-3 rounded-lg"
                />

                <ErrorMessage
                  name="customerName"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2">
                  Phone Number
                </label>

                <Field
                  name="phone"
                  className="w-full bg-gray-800 p-3 rounded-lg"
                />

                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block mb-2">
                  Urgency
                </label>

                <Field
                  as="select"
                  name="urgency"
                  className="w-full bg-gray-800 p-3 rounded-lg"
                >
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Very Urgent</option>
                </Field>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Posting Job...'
                  : 'Post Job'}
              </button>

            </Form>
  );
}
}
        </Formik>

      </div>
    </div>
  );
};

export default PostJobPage;