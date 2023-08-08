import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import MovieGridItem from './MovieGridItem';
import './MovieGrid.css';


export const MovieGrid = ({ movies, pagingCallback, itemsPerPage, dataCallback,
	ratingCallback, maxlength }) => {
	const [currentPage, setCurrentPage] = useState(1);

	const renderPrev = () => {
		if (currentPage > 1) {
			if (pagingCallback) {
				pagingCallback(currentPage - 1);
			}
			setCurrentPage(currentPage - 1);
		}
	}

	const renderNext = () => {
		if (currentPage * itemsPerPage < movies.length) {
			dataCallback();
		}
		if (pagingCallback) {
			pagingCallback(currentPage + 1);
		}
		setCurrentPage(currentPage + 1);
	}

	return (
		<Container className="gallery">
			<Row>
				<div className="grid-container">
					{(currentPage * itemsPerPage <= movies.length) ?
						<>
							{movies.slice((currentPage - 1) * itemsPerPage,
								currentPage * itemsPerPage)
								.map(currentMovie => (
									<MovieGridItem key={"TN_" + currentMovie.id}
										movieItem={currentMovie}
										handleRating={ratingCallback} />
								))}
						</>
						: <div style={{
							minWidth: "918px",
							minHeight: "fit-parent"
						}}>
							<Spinner animation="border" role="status"
								style={{
									margin: "18% 50%",
									width: "54px", height: "54px"
								}} />
						</div>
					}
				</div>
			</Row>
			<Row className="galleryFooter">
				<Col>
					<div className="btnDiv">
						<Button id="gallery-left-btn"
							disabled={currentPage === 1}
							variant="ers" onClick={renderPrev}>
							&lt;
						</Button>
					</div>
				</Col>
				<Col>
					<div className="btnDiv">
						<Button id="gallery-right-btn"
							disabled={currentPage * itemsPerPage === maxlength}
							variant="ers" onClick={renderNext}>
							&gt;
						</Button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default MovieGrid;