import { TestBed } from '@angular/core/testing';

import { PlayerAsisstanceService } from '../player-asisstance.service';

describe('PlayerAsisstanceService', () => {
  let service: PlayerAsisstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerAsisstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
