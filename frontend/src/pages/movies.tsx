import Base from "@/components/Base";
import Image from "next/image";
import { Component, ReactNode } from "react";
import styles from "../assets/styles/components/Movies.module.css";
import MovieImg from "../assets/images/movies/tgm.jpg";
import EnFlag from "../assets/images/flags/en.png";
import MovieCard from "@/components/MovieCard";
import tmdb from "@/api/tmdb";

class Movies extends Component {
    
    state = {
        movies: []
    }

    componentDidMount(): void {
        this.fetchMovies();
    }

    fetchMovies = async () => {
        const { data } = await tmdb.get("movie/popular");
        this.setState({ movies: data.results });
    }

    render(): ReactNode {
        return (
            <Base title="Hangama Stream | Movies">
                <div className={`container-fluid ${styles.item_container}`}>
                    <div className="row">
                        {this.state.movies.map((movie, index) => (
                            <MovieCard key={index} movie={movie} />
                        ))}
                    </div>
                </div>
            </Base>
        );
    }
}

export default Movies;