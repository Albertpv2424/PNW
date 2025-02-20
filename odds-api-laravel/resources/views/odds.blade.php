<!DOCTYPE html>
<html>
<head>
    <title>Odds</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <h1 class="my-4">Odds Data</h1>
        <a href="{{ route('sports.index') }}" class="btn btn-primary mb-4">Back to Sports</a>
        @if(session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif
        @forelse ($odds as $event)
            <div class="card mb-4">
                <div class="card-header">
                    <h3>{{ $event['home_team'] }} vs. {{ $event['away_team'] }}</h3>
                    <p>Start Time: {{ \Carbon\Carbon::parse($event['commence_time'])->format('d-m-Y H:i') }}</p>
                </div>
                <div class="card-body">
                    @foreach ($event['bookmakers'] as $bookmaker)
                        <div class="mb-3">
                            <ul class="list-group">
                                @foreach ($bookmaker['markets'][0]['outcomes'] as $outcome)
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        {{ $outcome['name'] }}
                                        <a class="badge badge-primary badge-pill">{{ $outcome['price'] }}</a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach
                </div>
            </div>
        @empty
            <div class="alert alert-warning">No odds available for this sport.</div>
        @endforelse
    </div>
</body>
</html>