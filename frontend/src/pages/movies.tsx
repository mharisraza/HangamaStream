import Base from "@/components/Base";
import Image from "next/image";
import React, { Component, ReactNode } from "react";
import styles from "../assets/styles/components/Movies.module.css";
import MovieImg from "../assets/images/movies/tgm.jpg";
import EnFlag from "../assets/images/flags/en.png";
import MovieCard from "@/components/MovieCard";
import tmdb from "@/api/tmdb";
import Movie from "@/types/Movie";

class Movies extends Component {


    state = {
        popularMovies: [] as Movie[],
        trendingMovies: [] as Movie[],
    }

    componentDidMount(): void {
        this.fetchPopularMovies();
        this.fetchTrendingMovies();
    }

    fetchPopularMovies = async () => {
        await tmdb.get("movie/popular").then((response) => {
            this.setState({ popularMovies: response.data.results });
        }).catch((error) => {
            console.log(error)
        })
    }

    fetchTrendingMovies = async () => {
        await tmdb.get("trending/movie/day").then((response) => {

            // here what we doing:
            // we wants to render 6 movies per row but if there is 20 movies then there will be too much empty left for the 4 movies
            // so to avoid that we've to remove extra movies if the row is incomplete
            
            const totalMovies: number = response.data.results.length;
            const moviesPerRow: number = 6;
            const totalRows: number = Math.floor(totalMovies / moviesPerRow); // Calculate the total number of complete rows

            const updatedTrendingMovies = [];

            for (let row = 0; row < totalRows; row++) {
                const startIndex = row * moviesPerRow;
                const endIndex = startIndex + moviesPerRow;
                const rowMovies = response.data.results.slice(startIndex, endIndex);
                updatedTrendingMovies.push(...rowMovies);
            }

            this.setState({ trendingMovies: updatedTrendingMovies });



        }).catch((error) => {
            console.log(error)
        })
    }



    render(): ReactNode {
        return (
            <Base title="Hangama Stream | Movies">
                <div className="container-fluid">

                    {/* Trending Movies  */}

                    <h1 className={`text-white fw-bold ${styles.item_section_title}`}>Trending</h1>
                    <div className={styles.item_container}>
                        {this.state.trendingMovies.map((movie, index) => (
                            <MovieCard key={index} movie={movie} />
                        ))}
                    </div>

                    {/* Popular Movies  */}

                    <h3 className={`text-white fw-bold ${styles.item_section_title}`}>Most Popular</h3>
                    <div className={`${styles.scrollable_container}`}>
                        <div className={`${styles.scrollable_item_container} mt-2`}>
                            {this.state.popularMovies.map((movie, index) => (
                                <MovieCard key={index} movie={movie} />
                            ))}
                        </div>
                    </div>
                </div>
            </Base>
        );
    }
}

export default Movies;