var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
});

// gulp.task('watch', ['browser-sync', 'sass'], function() {
//     gulp.watch('app/sass/**/*.sass', ['sass'])
// })
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.sass', gulp.series('sass'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: 'app'
    });

    browserSync.watch('app/**/*.*').on('change', browserSync.reload);
})

gulp.task('dev',
    gulp.series('sass', gulp.parallel('watch', 'serve'))
);