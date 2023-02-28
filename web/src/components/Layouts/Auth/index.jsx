import styles from './Auth.module.scss'

function Auth({children}){
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

export default Auth