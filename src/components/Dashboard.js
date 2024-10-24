import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const GET_OSSC_DATA = gql`
  query osscs {
    base_ossc {
      name
      region {
      
        name
      }
        subcity {
            name
        }
      created_at
    }
  }
`;

const GET_REGIONS = gql`
  query base_regions {
    base_regions {
      id
      name
    }
  }
`;


const GET_SUBCITIES = gql`
  query GetSubcities($regionId: ID!) {
    subcities(where: { region_id: { _eq: $regionId } }) {
      id
      name
    }
  }
`;


const Dashboard = () => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 5;


    const navigate = useNavigate();



    // Check if the user is logged in by checking for the access token in localStorage
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        // If no token is found, redirect to the login page
        if (!accessToken) {
            navigate('/');
        }
    }, [navigate]);



    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const { loading, error, data } = useQuery(GET_OSSC_DATA);

    const tableData = useMemo(() => {
        if (data) {
            return data.base_ossc;
        }
        return [];
    }, [data]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'OSSC Name',
            },
            {
                accessorKey: 'region.name',
                header: 'Region ID',
            },
            {
                accessorKey: 'subcity.name',
                header: 'Subcity Name',
            },
            {
                accessorKey: 'created_at', // New column for Created At
                header: 'Created At',
                cell: info => new Date(info.getValue()).toLocaleDateString(), // Format the date as needed
            },
        ],
        []
    );

    const table = useReactTable({
        data: tableData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage),
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleNextPage = () => {
        if ((currentPage + 1) * rowsPerPage < tableData.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };




    // State to manage form inputs
    const [formData, setFormData] = useState({
        osscName: '',
        region: '',
        description: '',
        zoneOrSubCity: '',
        pinNumber: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Here you can send the data to your API or handle it as needed
    };

    if (loading) return <p className="text-center text-blue-300">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error loading data: {error.message}</p>;


    const handleLogout = () => {
        // Clear all user-related data from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userFullName'); // Remove full name or any other relevant user data
        localStorage.removeItem('email');        // Example: if you also store email, remove it
        localStorage.removeItem('phoneNumber');  // Example: if phone number is stored, remove it

        // Redirect to login page after logout
        // navigate('/login');
        console.log('hello')
        navigate('/');

    };
    return (
        <div className="flex h-screen bg-gradient-to-r from-blue-700 to-blue-500 text-black pt-8">
            <div className="w-1/12 flex flex-col items-center justify-between py-8 bg-blue-900">
                <div className="flex flex-col items-center space-y-4">
                    <img src="image.png" alt="Logo" className="w-10 h-10" />
                    <div className="h-12 w-12 bg-blue-600 rounded-full flex justify-center items-center">
                        <span>+</span>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex flex-col p-8 space-y-4 relative">
                <div className="absolute top-8 right-8 flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                        <img src="iasmage.png" alt="User" onClick={handleLogout} className="w-10 h-10 rounded-full" />
                        {/* <span>User FullName</span> */}

                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                        >
                            Logout
                        </button>
                    </div>

                    <button
                        onClick={toggleModal}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg"
                    >
                        + Create OSSC
                    </button>
                </div>

                <div className="absolute top-8 left-8 w-full max-w-md">
                    <div className="relative text-gray-600">
                        <FiSearch className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search OSSC by name"
                            className="w-full p-3 pl-10 bg-white rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-800"
                        />
                    </div>
                </div>

                {/* Conditionally render the no documents message */}
                {tableData.length === 0 ? (
                    <div className="flex-grow flex flex-col justify-center items-center text-center">
                        <img src="images.png" alt="No Documents" className="w-20 h-20 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-blue-300">No documents</p>
                        <p className="text-blue-200">Start creating OSSC data</p>
                    </div>
                ) : (

                    <div className="pt-6"> {/* Adjust pt-6 to your desired padding */}

                        <div className="container mx-auto p-6">
                            <h1 className="text-3xl font-semibold mb-6 text-center text-blue-200">OSSC Dashboard</h1>
                            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">


                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-200 text-gray-700">
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(column => (
                                                    <th key={column.id} className="px-4 py-2 border-b text-left">
                                                        {column.header}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map(row => (
                                            <tr key={row.id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id} className="px-4 py-2 border-b">
                                                        {cell.getValue()}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Controls */}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="self-center text-blue-200">
                                    Page {currentPage + 1} of {Math.ceil(tableData.length / rowsPerPage)}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={(currentPage + 1) * rowsPerPage >= tableData.length}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative">
                        <button onClick={toggleModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                            <FiX size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Create OSSC</h2>
                        <form>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-700 font-semibold mb-2">OSSC Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-700 font-semibold mb-2">Region *</label>
                                    <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full">
                                        <option value="">Dropdown option</option>
                                        {/* Add more options here */}
                                    </select>
                                    <select
                                        name="region"
                                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                        value={formData.region}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Region</option>
                                        {data?.base_ossc.map((ossc, idx) => (
                                            <option key={idx} value={ossc.region.name}>
                                                {ossc.region.name}
                                            </option>
                                        ))}
                                    </select>


                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-700 font-semibold mb-2">Description</label>
                                <textarea
                                    placeholder="Write description"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-700 font-semibold mb-2">Zone or Sub-city *</label>
                                    <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full">
                                        <option value="">Select Zone or Sub-city</option>
                                        {/* Add more options here */}
                                    </select>
                                    <FiChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-700 font-semibold mb-2">Woreda or District *</label>
                                    <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full">
                                        <option value="">Select Woreda or District</option>
                                        {/* Add more options here */}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-700 font-semibold mb-2">House Number *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter house number"
                                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-700 font-semibold mb-2">Phone Number *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter phone number"
                                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                    />
                                </div>
                            </div>

                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition duration-150 ease-in-out">
                                Save
                            </button>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
