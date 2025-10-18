<?php
// Include database connection
include 'db_connect.php';

// Fetch all courses from database
$sql = "SELECT * FROM courses";
$result = $conn->query($sql);

$courses = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Featured Courses - Aviya Magnus</title>
    <!-- Meta and responsiveness -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Include same CSS as index.html -->
    <link rel="stylesheet" href="style.css"> <!-- assuming your index.html uses style.css -->
    
    <style>
        /* Additional overrides for courses page if needed */
        .courses-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin-top: 40px;
        }
        .course {
            background-color: #1b1b1b; /* dark card background */
            border: 1px solid #444;
            border-radius: 12px;
            padding: 25px;
            width: 300px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .course:hover {
            background-color: #2a2a2a;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }
        .course.highlight {
            background-color: #333;
            border-color: #fff;
        }
        .course h2 {
            font-size: 22px;
            margin: 0 0 10px 0;
            color: #fff; /* match index theme */
        }
        .course p {
            font-size: 14px;
            margin: 5px 0;
            color: #ccc; /* match index theme text */
        }
        h1 {
            text-align: center;
            margin-top: 30px;
            color: #fff; /* match index theme header */
        }
    </style>
</head>
<body>
    <!-- Optional: include same header/nav as index.html -->
    <?php include 'header.php'; ?> <!-- if you have a header file -->

    <h1>Featured Courses</h1>

    <div class="courses-container">
        <?php foreach($courses as $course): ?>
            <div class="course" onclick="highlightCourse(this)">
                <h2><?php echo $course['course_name']; ?></h2>
                <p><?php echo $course['description']; ?></p>
                <p><strong>Duration:</strong> <?php echo $course['duration']; ?></p>
                <p><strong>Price:</strong> ₹<?php echo $course['price']; ?></p>
            </div>
        <?php endforeach; ?>
    </div>

    <script>
        function highlightCourse(element) {
            // Remove highlight from all courses
            document.querySelectorAll('.course').forEach(el => el.classList.remove('highlight'));
            // Highlight the clicked course
            element.classList.add('highlight');
        }
    </script>

    <!-- Optional: include same footer as index.html -->
    <?php include 'footer.php'; ?> <!-- if you have a footer file -->

</body>
</html>
