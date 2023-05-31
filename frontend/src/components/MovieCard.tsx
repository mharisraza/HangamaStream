import Image from "next/image";
import React, { Component, ReactNode } from "react";
import styles from "../assets/styles/components/MovieCard.module.css";
import EnFlag from "../assets/images/flags/en.png";

type BaseProps = {
    movie: {
        title: string,
        release_date: string,
        poster_path: string,
    }
}

class MovieCard extends React.Component<BaseProps> {

    getPosterURL = (path: string) => {
        return `https://www.themoviedb.org/t/p/w220_and_h330_face${path}`
    }

    render(): ReactNode {

        const { title, release_date, poster_path } = this.props.movie;

        return (

            <div className="col-6 col-md-2">
                <div className={styles.item}>

                    <div className={styles.playIcon}>
                        <i className="fas fa-play"></i>
                    </div>

                    <Image className={styles.itemPoster} src={this.getPosterURL(poster_path)} alt="Movie Image" width={220} height={330} />
                    <div className={styles.item_information}>
                        <a>{title}</a>
                        <p>{release_date}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default MovieCard;