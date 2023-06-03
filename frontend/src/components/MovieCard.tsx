import Image from "next/image";
import React, { Component, ReactNode } from "react";
import styles from "../assets/styles/components/MovieCard.module.css";
import EnFlag from "../assets/images/flags/en.png";
import Link from "next/link";
import internal from "stream";
import tmdb from "@/api/tmdb";

type BaseProps = {
    movie: {
        id: number,
        title: string,
        release_date: string,
        poster_path: string,
    }
}

class MovieCard extends React.Component<BaseProps> {

    state = {
        movieDetails: {
            runtime: -1,
            vote_average: -1,
        }
    }

    getPosterURL = (path: string) => {
        return `https://www.themoviedb.org/t/p/w220_and_h330_face${path}`
    }

    getMoviesDetails = async (id: number) => {
        await tmdb.get(`movie/${id}`).then((response) => {
            this.setState({ movieDetails: response.data });
        }).catch((error) => {
            console.log(error);
        })
    }

    render(): ReactNode {

        const { id, title, release_date, poster_path } = this.props.movie;
        this.getMoviesDetails(id);

        let newTitle = title;
        let movieReleasedYear = release_date.substring(0, release_date.length - 6);
        let rated = this.state.movieDetails.vote_average.toString();

        if (title.length > 30) {
            newTitle = title.substring(0, 30) + "...";
        }

        return (
            <div className={styles.item}>
                <div className={styles.movie_thumbnail}>
                    <Image src={this.getPosterURL(poster_path)} alt={newTitle} width={150} height={220} />
                    <div className={styles.play_button}>
                        <Link href={`movie/${id}`} className="text-white"><i className="fas fa-play"></i></Link>
                    </div>
                </div>

                <div className={styles.movie_info}>
                    <Link href={`movie/${id}`} className="fw-bold">{newTitle}</Link>
                    <div className={styles.movie_info_split}>
                        <div>{movieReleasedYear}</div>
                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#aaa', display: 'inline-block' }}></div>
                        <div>{this.state.movieDetails.runtime}min</div>
                        <div style={{ flexGrow: 1 }}></div>
                        <div className={styles.movieRate}>
                            <i className="fas fa-star mx-1"></i>
                            {rated.substring(0, 3)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MovieCard;