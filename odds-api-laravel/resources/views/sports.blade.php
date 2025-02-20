<!DOCTYPE html>
<html>
<head>
    <title>Sports</title>
</head>
<body>
    <h1>Supported Sports</h1>
    <ul>
        @forelse ($sports as $sport)
            <li>
                <a href="{{ route('odds.show', $sport['key']) }}">
                    {{ $sport['title'] }} ({{ $sport['key'] }})  
                </a>
            </li>
        @empty
            <li>No sports found.</li>
        @endforelse
    </ul>
</body>
</html>