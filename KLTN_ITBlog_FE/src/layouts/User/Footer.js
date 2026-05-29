import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChuyenMucServices from '../../services/ChuyenMucServices';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const [categories, setCategories] = useState([]);
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await ChuyenMucServices.listAll();
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const splitIntoColumns = (categories, minColumns = 3, maxColumns = 5) => {
        const totalCategories = categories.length;
        const numColumns = Math.min(Math.max(Math.ceil(totalCategories / 5), minColumns), maxColumns);
        const columns = Array.from({ length: numColumns }, () => []);
        categories.forEach((category, index) => {
            columns[index % numColumns].push(category);
        });

        return columns;
    };

    const columns = splitIntoColumns(categories);

    return (
        <footer
            className={`footer-area ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}
            style={{
                backgroundColor: theme === 'dark' ? '#121212' : '#f8f9fa',
                color: theme === 'dark' ? 'white' : 'black',
            }}
        >
            <div className="container">
                <div className="row justify-content-center pb-30">
                    {columns.map((column, colIndex) => (
                        <div
                            key={`col-${colIndex}`}
                            className="col-md-4 d-flex flex-column align-items-center"
                        >
                            <div className="widget_categories text-center">
                                {column.map((category) =>
                                    category.name ? (
                                        <span
                                            key={category.category_id}
                                            className="cat-item mb-2"
                                        >
                                            <Link
                                                to={`/chuyen-muc/${category.slug}`}
                                                style={{
                                                    color: theme === 'dark' ? 'white' : 'black',
                                                }}
                                            >
                                                {category.name}
                                            </Link>
                                        </span>
                                    ) : null
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="footer-bottom-area"
                style={{
                    backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f8f9fa',
                    color: theme === 'dark' ? '#e0e0e0' : '#6c757d',
                    borderTop: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                    padding: '20px 0',
                }}
            >
                <div className="container">
                    <div className="text-center">
                        <div className="footer-copy-right">
                            <p
                                className="font-small mb-0"
                                style={{
                                    color: theme === 'dark' ? '#d1d1d1' : '#6c757d',
                                }}
                            >
                                © {currentYear}, ITBlog | All rights reserved | Created by Huong Tien
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
