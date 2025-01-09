import { Image } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import './MovieGridItem.css';
import { MovieGridItemProps } from './MovieGridItem.types';

const MovieGridItem: React.FC<MovieGridItemProps> = ({
	movieItem,
	ratingCallback
}) => {
	movieItem.rating = movieItem.rating || 0;

	const handleRating = (newRating: number) => {
		ratingCallback(newRating, movieItem.id);
	}

	return (
		<li id={"TN_" + movieItem.id}
			className={"grid-item"}>
			<Image className="grid-item-image" height="200px" width="140px"
				src={movieItem.poster} 
				alt={movieItem.title}
				onError={(evt) => {
					evt.currentTarget.src = "https://commons.wikimedia.org/wiki/Category:SVG_film_reel_icons#/media/File:Filmreel-icon.svg";
				}} />
			<div className={movieItem.rating > 0 ? "rated overlay" : "overlay"}>
				<div className={movieItem.rating > 0 ? 'star-div-rated' : 'star-div'}>
					<StarRatings
						rating={movieItem.rating}
						starRatedColor="rgb(252,229,65)"
						starHoverColor="rgb(252,229,65)"
						starDimension="18px"
						starSpacing="1px"
						changeRating={handleRating}
						numberOfStars={5}
						name={movieItem.id} />
				</div>
			</div>
			<div className="grid-item-label">
				{movieItem.title + " (" + movieItem.year + ")"}
			</div>
		</li>
	);
}

export default MovieGridItem;